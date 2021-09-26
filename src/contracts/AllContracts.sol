pragma solidity ^0.6.0;

// "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED"

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IFlashLoanReceiver {
    function executeOperation(address _reserve, uint256 _amount, uint256 _fee, bytes calldata _params) external;
}

contract ERC20PolyPool is IERC20 {
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;
    using SafeMath for uint256;
    
    mapping(uint256 => uint256) public settings;
    mapping(uint256 => bool) public fixSettings;
    
    uint256 public shareIter = 0;
    
    mapping(uint256 => address) public shareAddress;
    mapping(address => bool) public share;
    
    bool fixShare;
    address owner;
    
    bool public flashLock = false;
    
    uint256 public maxBid;
    uint256 public equalizerBlock;
    
    mapping(address => uint256) public bids;
    address public auction;
    address public trader;
    
    mapping(address => uint256) public waitBlock;
    mapping(address => uint256) public waitValue;
    
    string public name;
    string public symbol;
    uint8  public decimals;
    
    uint256 public traderTrackIter = 0;
    
    mapping(uint256 => uint256) public inMap;
    mapping(uint256 => uint256) public outMap;
    mapping(uint256 => uint256) public feeMap;
    mapping(uint256 => address) public traderMap;
    
    mapping(uint256 => address) public buyMap;
    mapping(uint256 => address) public sellMap;
    
    mapping(uint256 => uint256) public timeMap;
    
    address public freeTaxes;
    
    constructor(uint256 total, address au, address mowner, string memory myName, string memory mySymbol, uint8 myDecimals, address mixPool)
    public
    {
        totalSupply_ = total;
        balances[mowner] = totalSupply_;
        
        owner = mowner;
        auction = au;
        name = myName;
        symbol = mySymbol;
        decimals = myDecimals;
        
        freeTaxes = mixPool;
    }
    
    function totalSupply() public override view returns (uint256)
    {
        return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public override view returns (uint256)
    {
        return balances[tokenOwner];
    }
    
    function transfer(address receiver, uint256 numTokens) public override returns (bool)
    {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    function approve(address delegate, uint256 numTokens) public override returns (bool)
    {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    function allowance(address mowner, address delegate) public override view returns (uint)
    {
        return allowed[mowner][delegate];
    }
    
    function transferFrom(address mowner, address buyer, uint256 numTokens) public override returns (bool)
    {
        require(numTokens <= balances[mowner]);
        require(numTokens <= allowed[mowner][msg.sender]);
        balances[mowner] = balances[mowner].sub(numTokens);
        allowed[mowner][msg.sender] = allowed[mowner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(mowner, buyer, numTokens);
        return true;
    }
    
    function doBid(uint256 _value) public
    {
        require(!flashLock);
        IERC20 au = IERC20(auction);
        require(au.transferFrom(msg.sender, address(this), _value));
        bids[msg.sender] = bids[msg.sender].add(_value);
        
        if(bids[msg.sender] > maxBid)
        {
            maxBid = bids[msg.sender];
            trader = msg.sender;
        }
    }
    
    function equalize()
        public
    {
        require(block.number - equalizerBlock > settings[7]);
        
        equalizerBlock = block.number;
        
        maxBid = maxBid.sub(maxBid/10);
        bids[trader] = maxBid;
    }
    
    function trade(uint256 _value, address _tokenAddressIn, address _tokenAddressOut)
        public
    {
        require(!flashLock);
        require(trader == msg.sender);
        require(share[_tokenAddressIn]);
        require(share[_tokenAddressOut]);
        
        IERC20 ercIn = IERC20(_tokenAddressIn);
        IERC20 ercOut = IERC20(_tokenAddressOut);
        
        require(ercIn.transferFrom(msg.sender, address(this),_value));
        uint256 outVal = (_value.mul(ercOut.balanceOf(address(this)))).div(ercIn.balanceOf(address(this)));
        
        uint256 fee = (outVal.div(settings[3]));
        if(settings[4] > 1)
            fee = fee.add(((outVal.mul(outVal)).div(ercOut.balanceOf(address(this)))).div(settings[5]));
        
        outVal = outVal.sub(fee);
        
        uint256 swapfee = outVal.div(settings[9]);
        outVal = outVal.sub(swapfee);
        fee = fee.add(swapfee);
        
        require(ercOut.transfer(freeTaxes,swapfee));
        require(ercOut.transfer(msg.sender,outVal));
        
        traderTrackIter++;
    
        inMap[traderTrackIter] = _value;
        outMap[traderTrackIter] = outVal;
        feeMap[traderTrackIter] = fee;
        
        traderMap[traderTrackIter] = msg.sender;
    
        buyMap[traderTrackIter] = _tokenAddressIn;
        sellMap[traderTrackIter] = _tokenAddressOut;
    
        timeMap[traderTrackIter] = block.number;
    }
    
    function getPrice(uint256 _value, address _tokenAddressIn, address _tokenAddressOut) public view returns (uint256)
    {
        require(share[_tokenAddressIn]);
        require(share[_tokenAddressOut]);
        
        IERC20 ercIn = IERC20(_tokenAddressIn);
        IERC20 ercOut = IERC20(_tokenAddressOut);
        
        uint256 outVal = (_value.mul(ercOut.balanceOf(address(this)))).div(ercIn.balanceOf(address(this)));
        
        uint256 fee = (outVal.div(settings[3]));
        if(settings[4] > 1)
            fee = fee.add(((outVal.mul(outVal)).div(ercOut.balanceOf(address(this)))).div(settings[5]));
        
        outVal = outVal.sub(fee);
        return outVal;
    }
    
    function createNewToken(uint256 _value) public
    {
        require(shareIter > 0);
        require(!flashLock);
        
        uint256 t_value = _value.sub(_value.div(settings[0]));
        for(uint256 i = 0; (i < shareIter); i++)
        {
            IERC20 liquidityToken = IERC20(shareAddress[i]);
            uint256 need = _value.mul(liquidityToken.balanceOf(address(this))).div(totalSupply_);
            require(liquidityToken.transferFrom(msg.sender, address(this), need));
            
            totalSupply_ = totalSupply_.add(t_value);
            balances[msg.sender] = balances[msg.sender].add(t_value);
        }
    }
    
    function getLiquidity(uint256 _value) public
    {
        require(shareIter > 0);
        require(!flashLock);
        
        IERC20 auToken = IERC20(auction);
        uint256 needSend = _value.mul(auToken.balanceOf(address(this))).div(totalSupply_);
        
        needSend = needSend.sub(needSend.div(settings[2]));
        require(auToken.transfer(msg.sender,needSend));
        
        for(uint256 i = 0; (i < shareIter); i++)
        {
            IERC20 liquidityToken = IERC20(shareAddress[i]);
            uint256 need = _value.mul(liquidityToken.balanceOf(address(this))).div(totalSupply_);
            
            balances[msg.sender] = balances[msg.sender].sub(_value);
            totalSupply_ = totalSupply_.sub(_value);
            
            need = need.sub(need.div(settings[1]));
            
            require(liquidityToken.transfer(msg.sender,need));
        }
    }
    
    function wait(uint256 _value) public
    {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        
        waitBlock[msg.sender] = block.number;
        waitValue[msg.sender] = waitValue[msg.sender].add(_value);
    }
    
    function getLiquidityAfterTime() public
    {
        require(!flashLock);
        require(shareIter > 0);
        require(waitBlock[msg.sender] + settings[6] > block.number);
        
        balances[msg.sender] = balances[msg.sender].add(waitValue[msg.sender]);
        uint256 _value = waitValue[msg.sender];
        
        waitValue[msg.sender] = 0;
        
        IERC20 auToken = IERC20(auction);
        uint256 needSend = _value.mul(auToken.balanceOf(address(this))).div(totalSupply_);
        
        needSend = needSend.sub(needSend.div(settings[2]));
        require(auToken.transfer(msg.sender,needSend));
        
        for(uint256 i = 0; (i < shareIter); i++)
        {
            IERC20 liquidityToken = IERC20(shareAddress[i]);
            uint256 need = _value.mul(liquidityToken.balanceOf(address(this))).div(totalSupply_);
            
            balances[msg.sender] = balances[msg.sender].sub(_value);
            totalSupply_ = totalSupply_.sub(_value);
            
            require(liquidityToken.transfer(msg.sender,need));
        }
    }
    
    function flashLoan(address _receiver, uint256 _amount, bytes memory _params, address _tokenAddress)
        public
    {
        flashLock = true;
        IERC20 erc = IERC20(_tokenAddress);
        
        require(
            erc.balanceOf(address(this)) >= _amount,
            "There is not enough liquidity available to borrow"
        );
        
        uint256 availableLiquidityBefore = erc.balanceOf(address(this));

        IFlashLoanReceiver receiver = IFlashLoanReceiver(_receiver);
        address payable userPayable = address(uint160(_receiver));

        //transfer funds to the receiver
        erc.transfer(userPayable, _amount);
        
        uint256 amountFee = (_amount).div(settings[8]);

        //execute action of the receiver
        receiver.executeOperation(address(this), _amount, amountFee, _params);

        uint256 availableLiquidityAfter = erc.balanceOf(address(this));
        
        require(
            availableLiquidityAfter == availableLiquidityBefore.add(amountFee),
            "The actual balance of the protocol is inconsistent"
        );
        
        flashLock = false;
    }
    
    function changeOwner(address newOwner) public
    {
        require(msg.sender == owner);
        owner = newOwner;
    }
    
    function changeShare(address _tokenAddress, bool _last) public
    {
        require(!fixShare);
        require(msg.sender == owner);
        
        if(!share[_tokenAddress])
        {
            shareAddress[shareIter] = _tokenAddress;
            shareIter++;
        }
        
        share[_tokenAddress] = true;
        fixShare = _last;
    }
    
    function setSettings(uint256 _value, uint256 _setting, bool _fix) public
    {
        require(!fixSettings[_setting]);
        require(msg.sender == owner);
        
        settings[_setting] = _value.add(1);
        fixSettings[_setting] = _fix;
    }
}

contract Polynom {
    using SafeMath for uint256;
    
    IERC20 polynomERC20;
    address public polynomAddress;
    address public superUser; // can change default settings
    
    address public reserve;
    
    uint256 public mapIter = 0;
    mapping(uint256 => address) public addressMap; 
    mapping(address => bool) public boolMap; 
    
    mapping(uint256 => uint256) public settings;
    
    constructor(address mToken, address _reserve) public
    {
        polynomERC20 = IERC20(mToken);
        polynomAddress = mToken;
        
        superUser = msg.sender;
        
        settings[0] = 100;
        settings[1] = 200;
        settings[2] = 100;
        settings[3] = 200;
        settings[4] = 2;
        settings[5] = 10;
        settings[6] = 200;
        settings[7] = 2000;
        settings[8] = 2000;
        settings[9] = 1000;
        
        reserve = _reserve;
    }
    
    function newContract(uint256 _value, address _mOwner, string memory _mName, string memory _mSymbol, uint8 _mDecimals)
        public
    {
	        ERC20PolyPool erc20a = new ERC20PolyPool(_value, polynomAddress, address(this), _mName, _mSymbol,_mDecimals, reserve);
	        
	        addressMap[mapIter] = address(erc20a);
		    boolMap[address(erc20a)] = true;

	        mapIter++;
	        
	        for(uint8 i = 0; i < 10; i++)
	        {
	            erc20a.setSettings(settings[i],i,false);
	        }
	        
	        erc20a.changeOwner(_mOwner);
    }
    
    function setSettings(uint256 _value, uint256 _setting) public
    {
        require(msg.sender == superUser);
        settings[_setting] = _value.add(1);
    }
}

contract SimpleERC20Token {
    // Track how many tokens are owned by each address.
    mapping (address => uint256) public balanceOf;

    string public name;
    string public symbol;
    uint8 public decimals;

    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 total, string memory myName, string memory mySymbol, uint8 myDecimals) public
    {
        totalSupply = total;
        // Initially assign all tokens to the contract's creator.
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
        
        name = myName;
        symbol = mySymbol;
        decimals = myDecimals;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value);

        balanceOf[msg.sender] -= value;  // deduct from sender's balance
        balanceOf[to] += value;          // add to recipient's balance
        emit Transfer(msg.sender, to, value);
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => mapping(address => uint256)) public allowance;

    function approve(address spender, uint256 value)
        public
        returns (bool success)
    {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value)
        public
        returns (bool success)
    {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256)
    {
      assert(b <= a);
      return a - b;
    }
    
    
    function add(uint256 a, uint256 b) internal pure returns (uint256)
    {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
    
    function mul(uint256 a, uint256 b) internal pure returns (uint256)
    {
        if (a == 0)
        {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256)
    {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }
}

contract ERC20MixedPool {

    using SafeMath for uint256;
    
    address public polyToken;
    mapping(address => mapping (address => uint256)) public providers;
    mapping(address => address) public bestProvider;
    
    mapping(address => uint256) public lockTime;
    mapping(address => uint256) public lockValue;
    
    uint256 public wait;
    
    bool public flashLock = false;
    uint256 public flashDivider = 10000;
    
    uint256 public flashSum = 10000;
    uint256 public flashVote = 1;
    
    uint256 public flashBlock = 0;
    
    constructor (address _token, uint256 _timer) public
    {
        polyToken = _token;
        wait = _timer;
    }
    
    function provide(address _provider, address _token, uint256 _value) public
    {
        require(!flashLock);
        IERC20 liqToken = IERC20(_token);
        require(liqToken.transferFrom(_provider, address(this), _value));
        
        providers[_provider][_token] = providers[_provider][_token].add(_value);
        if(providers[bestProvider[_token]][_token] < providers[_provider][_token])
        {
            bestProvider[_token] = _provider;
        }
    }
    
    function getLiquidity(address _token, uint256 _value, uint256 _divider) public
    {
        IERC20 erc = IERC20(polyToken);
        require(erc.transferFrom(msg.sender, bestProvider[_token], _value));
        
        IERC20 ercToken = IERC20(_token);
        
        uint256 outVal = (((ercToken.balanceOf(address(this))).mul(_value)).div(erc.totalSupply()));
        uint256 fee = outVal.div(10);
        
        require(erc.transfer(msg.sender, outVal.sub(fee)));
        
        lockValue[msg.sender] = lockValue[msg.sender].add(fee);
        lockTime[msg.sender] = block.number;
        
        flashSum  += fee.mul(_divider);
        flashVote += fee;
        
    }
    
    function getLocked() public
    {
        require(wait +  lockTime[msg.sender]  < block.number);
        
        IERC20 erc = IERC20(polyToken);
        require(erc.transfer(msg.sender, lockValue[msg.sender]));
        lockValue[msg.sender] = 0;
    }
    
    function updateFlashLoanPrice() public
    {
        require((wait * 10) + flashBlock < block.number);
        flashBlock = block.number;
        
        flashDivider = flashSum.div(flashVote);
        
    }
    
    function flashLoan(address _receiver, uint256 _amount, bytes memory _params, address _tokenAddress)
        public
    {
        flashLock = true;
        IERC20 erc = IERC20(_tokenAddress);
        
        require(
            erc.balanceOf(address(this)) >= _amount,
            "There is not enough liquidity available to borrow"
        );
        
        uint256 availableLiquidityBefore = erc.balanceOf(address(this));

        IFlashLoanReceiver receiver = IFlashLoanReceiver(_receiver);
        address payable userPayable = address(uint160(_receiver));

        //transfer funds to the receiver
        erc.transfer(userPayable, _amount);
        
        uint256 amountFee = (_amount).div(flashDivider);

        //execute action of the receiver
        receiver.executeOperation(address(this), _amount, amountFee, _params);

        uint256 availableLiquidityAfter = erc.balanceOf(address(this));
        
        require(
            availableLiquidityAfter == availableLiquidityBefore.add(amountFee),
            "The actual balance of the protocol is inconsistent"
        );
        
        flashLock = false;
    }
}