//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts@4.5.0/utils/Counters.sol";
import "@openzeppelin/contracts@4.5.0/utils/cryptography/MerkleProof.sol";
contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
     string private unRevealedURL="ipfs://ghjkgdgfhjbghttyuyutuuy/";

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public wp2_cost = 0.0077 ether;
    uint256 public pp_cost = 0.0099 ether;
    uint256 public maxSupply = 4500;

    bool public paused = false;
    bool public revealed = false;


    bool public whitelister_phase1= true;
    bool public whitelister_phase2= false;
    bool public publicSalePhase=false;

    uint256 public wp1_limit = 1;
    uint256 public wp2_limit = 3;
    // uint256 public pp_limit = 5;

    mapping(address=>uint) public wp1;
    mapping(address=>uint) public wp2;
    mapping(address=>uint) public pp;


    using Counters for Counters.Counter;
    bytes32 public root1;
    bytes32 public root2;

    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory _initBaseURI,
        bytes32 _root1,
        bytes32 _root2

    ) ERC721("Club Ollie", "CO") {

        setBaseURI(_initBaseURI);
        root1 = _root1;
        root2 = _root2;

    }


    function safeMint(address to, bytes32[] memory proof, uint _mintAmount) public payable {
        // require(isValid(proof, keccak256(abi.encodePacked(msg.sender))), "Not a part of Allowlist");
        uint256 supply = totalSupply();

        bool isWhitelister1=isValid1(proof, keccak256(abi.encodePacked(msg.sender)));
        bool isWhitelister2=isValid2(proof, keccak256(abi.encodePacked(msg.sender)));

            if(whitelister_phase1)
            {

                require(isWhitelister1,"not whitelister");
                require(wp1[msg.sender] < wp1_limit ,"limit over");
                require(_mintAmount==wp1_limit,"cant mint more than 1");
                wp1[msg.sender]++;

            }
            else if(whitelister_phase2)
            {
                
                require(isWhitelister2,"not whitelister");
                require(wp2[msg.sender] < wp2_limit ,"limit over");
                require(_mintAmount <= (wp2_limit - wp2[msg.sender]),"cant mint");
                require((_mintAmount* wp2_cost)<=msg.value,"unsufficient amount");
                wp1[msg.sender]+=_mintAmount;

            } 
            else if(publicSalePhase){

                // require(pp[msg.sender] < pp_limit ,"limit over");
                // require(_mintAmount <= (pp_limit - pp[msg.sender]),"cant mint");
                require((_mintAmount* pp_cost)<=msg.value,"unsufficient amount");
                pp[msg.sender]+=_mintAmount;

            }
        
        for (uint256 i = 1; i <= _mintAmount; i++)
            {
                _safeMint(to, supply + i);
            }    
        
        }


    function isValid1(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        
        return MerkleProof.verify(proof, root1, keccak256(abi.encodePacked(leaf)));
    }

    function isValid2(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, root2, keccak256(abi.encodePacked(leaf)));
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }



    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if(revealed == true)
        {
            require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
            );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
        }
        else{
            return unRevealedURL;
        }

    }

    //only owner

    function set_root1(bytes32 _value) public onlyOwner {
        root1 = _value;
    }
    
    function set_root2(bytes32 _value) public onlyOwner {
        root2 = _value;
    }


    function set_wp2Cost(uint256 _newCost) public onlyOwner {
        wp2_cost = _newCost;
    }

    function set_ppCost(uint256 _newCost) public onlyOwner {
        pp_cost = _newCost;
    }

    function set_wp1_limit(uint256 _value) public onlyOwner {
        wp1_limit = _value;
    }
    
    function set_wp2_limit(uint256 _value) public onlyOwner {
        wp2_limit = _value;
    }
    
    // function set_pp_limit(uint256 _value) public onlyOwner {
    //     pp_limit = _value;
    // }
    
    function set_whitelister_phase1(bool _value) public onlyOwner {
        whitelister_phase1 = _value;
    }
    
    function set_whitelister_phase2(bool _value) public onlyOwner {
        whitelister_phase2 = _value;
    }
    
    function set_public_phase(bool _value) public onlyOwner {
        publicSalePhase = _value;
    }

    function set_reveal(bool _value) public onlyOwner {
        revealed = _value;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }


    function AirDrop(address[] calldata _to,uint256[] calldata _id) external onlyOwner{
        require(_to.length == _id.length,"receivers and ids have different lengths");
        for(uint i=0;i<_to.length;i++)
        {
            safeTransferFrom(msg.sender,_to[i],_id[i]);
        }
    }




    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
    function curr_time() view public  returns(uint)
    {
        return block.timestamp;
    }

}