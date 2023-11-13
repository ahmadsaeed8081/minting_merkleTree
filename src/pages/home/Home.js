import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useAccount} from "wagmi";
import Web3 from "web3";
import {
cont_abi,cont_add
} from "../../components/config";
import { useNetwork, useSwitchNetwork } from "wagmi";
import {
  useContractReads,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import axios  from 'axios';
import { MerkleTree } from 'merkletreejs'
import { keccak256 }  from 'keccak256'
// import {keccak256} from "ethereum-cryptography/keccak"
const Home = () => {

    const [quantity, set_quantity] = useState("");
    const [presaleTime, set_presaleTime] = useState(0);

    const increment = () => {
      set_quantity(Number(quantity) + 1);
      find_totalAmount()
    };
    const decrement = () => {
      if (Number(quantity) > 1) {
        set_quantity(Number(quantity) - 1);
        find_totalAmount()

      }
    };

    // const proof1=["0xfabe60f1de63230b1d229b6b6084184151d384ff17a4882fb56201d5fb795dda","0xd178ccb819c6885b980fd35d2d682abe97275bceeadd03a7418d9ad8d8c760b6","0x18591696f63ede8dd68a25a491d6713a8fd59fda69ff80f32990f6d2600cc392","0xfd1bc2f10a229b82ff5a1af1332311e0357da3b001b15546fcba3bc7cb9f8b95","0x953fd6cfc3344a0e713297fbd9b0b8e7b1e5c5336816f30367766ed3af47648a","0xd9212db418c6df55d581d9ac010a4e0221acad4e462933d4c326202d715cb903","0x0ed6480a351a284f2663608442d4dc56fe3ac79a30fb3c7b936738f544523a82"];

    const proof2=["0xfb58768b20b7891b1ad92c712462a77ef523d3a6e8bbee853463e90db626d338","0xac1853597350349b2f42210b85975d652a9b51fb0a26eadb0423bc2ec1c63abb","0x709863e51f8120d049df588df324d3437a5acff5ce3d33c969a3562397dc4a97","0xfb23ea6ccb39f20b024ebb55b843c364491ee3ea2fe48c828117ddd74643ad87","0x2a6251735bfbd18873de6b5e9463a8effd2ca45558f3a8f02cc97ea0d14005ca","0xd0b24ce611d61fa975f775010dc1ea19a1a043ccdb8e49908e10df49c8fc989e","0xff6e0187b462813c33c15227e05556480827cda72240c2b7f16e721e4204a68d","0x4ae157ea220d249ad55d00857ef107c0d425c1418ebf22713ec62cde42e20116","0xb489ba9473de8dd4a8684639e626a1a13d2084b47d9effbc2cc3941d5919d5d5"];

    const targetTime = new Date("2035-01-01").getTime();

    const [currentTime, setCurrentTime] = useState(Date.now());

    const timeBetween = (Number(presaleTime)*1000) - currentTime;
    const seconds = Math.floor((timeBetween / 1000) % 60);
    const minutes = Math.floor((timeBetween / 1000 / 60) % 60);
    const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);

    const networkId = 80001;




    const [totalCount, setTotalCount] = useState(0);
    const { address, isConnected } = useAccount();
    const [wp2Cost, set_wp2Cost] = useState(0);
    const [wp1Cost, set_wp1Cost] = useState(0);

    const [supply, set_supply] = useState(0);
    const [cost, set_cost] = useState(0);
    const [ref_percentage, set_ref_percentage] = useState(0);
    const [total_price, set_total_price] = useState(0); 
    const [maxSupply, set_maxSupply] = useState(0);
    const [balance, set_balance] = useState(0);
    const [curr_time, set_curr_time] = useState("");
    const [curr_price, set_curr_price] = useState("");
    const [wp2_cost,set_wp2_cost ] = useState("");
    const [whitelister_phase1,set_whitelister_phase1 ] = useState("");
    const [whitelister_phase2,set_whitelister_phase2 ] = useState("");
    const [publicSalePhase,set_publicSalePhase ] = useState("");
    const [wp1_limit,set_wp1_limit] = useState("");
    const [wp2_limit,set_wp2_limit] = useState("");
    const [wp1_totalBought,set_wp1_totalBought] = useState("");
    const [wp2_totalBought,set_wp2_totalBought] = useState("");
    const [isWhitelister1,set_isWhitelister1] = useState("");
    const [isWhitelister2,set_isWhitelister2 ] = useState("");
    const [publicCost,set_publicCost ] = useState("");
    const [curr_proof,set_curr_proof ] = useState([]);

    
    const [ref, set_ref] = useState("0x0000000000000000000000000000000000000000");
  
  
  
  
    const { chain } = useNetwork();
  
  
  
    const {
      data: stakeResult,
      isLoading: isLoading_stake,
      isSuccess: stakeSuccess,
      write: mint,
    } = useContractWrite({
      address: cont_add,
      abi: cont_abi,
      functionName: "safeMint",
      args: [address,curr_proof,quantity],
      value: (Number(quantity)* Number(curr_price)).toString(),
      // value: ((perPlpValue * ((stakeAmount * 3)/100))/perPlsUsd)/10**18,
      onSuccess(data) {
        test();
        console.log("Success", data);
      },
    });
  
  
  
  function set_merkle()
  {
    const addresses = ["0x1C541e05a5A640755B3F1B2434dB4e8096b8322f","0x1071258E2C706fFc9A32a5369d4094d11D4392Ec","0x25f7fF7917555132eDD3294626D105eA1C797250","0xF6574D878f99D94896Da75B6762fc935F34C1300","0xfDbAb374ee0FC0EA0D7e7A60917ac01365010bFe","0xfB73f8B1DcD5d61D4dDC3872dA53200B8562F243","0x95F6E4C94857f605b9A73c9163D5c94AAf849c40","0xEd2C82417256DF74a995213713A586E07d3e5255","0xCb14d0D43BB32705fAbbD863f860A1410fa14613","0x7a865e44988a2ebcad845E977db07C71f8c62d31","0x340F5bEcB63a33B53959026d0CEb1f83C53A102F","0x969560dBBf4872049D0d245791eD74dEd0D66578","0x81B8888dfbdcc3Ad1dfe30A6f58a6d47eaf99aE8","0x29aB6E246c4aC305974A730B10459417FF65D469","0x2B790Dd5d9440f098E057E4958e3Ac0214712352","0xA53E16be846D815dfF774A384858021952b5B22E","0x04473648f6BeA9b074DFd7693b20AFCF9971a125","0xc26716b827c0d207AA3D25667028C2da1De787bf","0x21BAa9441e2DF389Ca27c9dB1cD9B59f2504dfEa","0x93D5193694a49eB85366ea1BDa69B577f1b878ae","0x3654322cFecCD60965A8b7866f50e55FE14EEBCC","0x174BAFfcB004ACfc53cDD3A48957b9D353BB171f","0x1d9A510DfCa2b1f3C52BD81122816FD86C7C7Ba0","0x55ae457519BbAf25d825772da81F57bD18E4B6Db","0x0997680928431EA22C1930c12Dc91f06d10be0c6","0xF9E8383bd1250aCf18Da971467B70045d4D06fB1","0x847aB63F94e931F9264407C54C97DbCfFEC9f8FE","0x5dcE9Fc14eED67D046A130d1d991163114b2820c","0x53b5585AA42b79B0b8e620896ceB0D0435441071","0x5E661e550Fcac43DEC925449A7F0bCA0C32D6A44","0xA46f327d91282aFD4E99d79a8fD7Eac7A123dAF5","0xD03241a89a18c779B71f1bD348d2BbF1e20b8ea8","0xed0850a960ABE5715ECEa4b479272092733922f0","0x4D15f921A25e8677Da2d878B01c80Df861E67F03","0x98d450BfbBFD64D780B632f6acd0FC59d11E575e","0xaef0FfA370108915d4198Fe6eF40eBa446f00d79","0x5Bc46cf525E6E26f8799685E5247a93355354cBf","0x5B9837c339F7b55564Aeb185e8DEdeEDD10AfcB7","0xbda8049200F7a42312AFeBDb5b99D514EE0df302","0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
    const leaves = addresses.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    // const buf2hex = x => '0x' + x.toString('hex')
  
    // console.log(buf2hex(tree.getRoot()))
  
    // const leaf = keccak256(address) // address from wallet using walletconnect/metamask
    // const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
  
    // contract.methods.safeMint(address, proof).send({ from: address }) // will be called on click of the mint button
  }
    
    async function mintNft() {


      if(whitelister_phase1)
      {
        if(!isWhitelister1)
        {
          alert("You are not a Whitelister");
          return;
        }
        if(wp1_totalBought>0)
        {
          alert("You have minted! You cant't mint more than 1 NFT");
          return;
        }
        if(quantity>1)
        {
          alert("You cant't mint more than 1 NFT");
          return;
        }
        


      }
      else if(whitelister_phase2)
      {
        if(!isWhitelister2)
        {
          alert("You are not a Whitelister");
          return;
        }
        if(wp2_totalBought>=3)
        {
          alert("You have minted! You cant't mint more than 3 NFT");
          return;
        }
        if(quantity> (Number(wp2_limit) - Number(wp2_totalBought)) )
        {
          alert("You cant't mint more than 3 NFT");
          return;
        }
      }
      // else if(publicSalePhase)
      // {
        
      //   curr_price=Number(publicCost)*Number(quantity);

      // }


      if((Number(curr_price) * Number(quantity)) > Number(balance) )
      {
        alert("you dont have enough balance to buy");
        return
      }
      if(Number(quantity) == 0 || quantity == "")
      {
        alert("kindly write the amount");
        return
      }
  
      if (chain.id != networkId) {
        mint_switch?.();
      } else {
        mint?.();
      }
    }
  
  
    useEffect(()=>{
  
      if(isConnected)
      {
        test();
      }
    
    },[address])
  
    function Convert_To_Wei(val) {
      const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor.publicnode.com	"));
    
      val = web3.utils.toWei(val.toString(), "ether");
      return val;
    }
  
    async function test() 
    {
  
      const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor.publicnode.com	"));
  
  
      const balance = await web3.eth.getBalance(address);
      const contract = new web3.eth.Contract(cont_abi, cont_add);
      console.log("object1");
      let isWhitelister1;
      let isWhitelister2;
      let supply = await contract.methods.totalSupply().call();

      let public_cost = await contract.methods.pp_cost().call();
      let wp2_cost = await contract.methods.wp2_cost().call();

      let whitelister_phase1 = await contract.methods.whitelister_phase1().call();  
      let whitelister_phase2 = await contract.methods.whitelister_phase2().call();  
      let publicSalePhase = await contract.methods.publicSalePhase().call();  

      let wp1_limit = await contract.methods.wp1_limit().call();  
      let wp2_limit = await contract.methods.wp2_limit().call();   

      let wp1_totalBought = await contract.methods.wp1(address).call();  
      let wp2_totalBought = await contract.methods.wp2(address).call();
      let currentTime = await contract.methods.curr_time().call();  
      
      let maxSupply = await contract.methods.maxSupply().call()
      // const res0 =await axios.get("https://merkletreeapi-production-eedc.up.railway.app/proof1?"+ new URLSearchParams({
      //   userAddress: address}));

      //   alert(res0.data)

      if(whitelister_phase1)
      {
        const res0 =await axios.get("https://merkletreeapi-production-eedc.up.railway.app/proof1?"+ new URLSearchParams({
          userAddress: address}));

        set_curr_price(0)

         isWhitelister1 = await contract.methods.isValid1(res0.data,address).call({from : address});  


        set_curr_proof(res0.data[0])

      }
      else if(whitelister_phase2)
      {

        const res0 =await axios.get("https://merkletreeapi-production-eedc.up.railway.app/proof2?"+ new URLSearchParams({
          userAddress: address}));
         isWhitelister2 = await contract.methods.isValid2(res0.data,address).call({from : address});  

        set_curr_proof(res0.data[0])
        set_curr_price(wp2_cost)

      }
      else if(publicSalePhase)
      {
        // set_curr_proof(proof2)
        set_curr_price(public_cost)


      }
  
      set_curr_time(currentTime);
      set_maxSupply(maxSupply);
      set_publicCost(public_cost)
      set_wp2_cost(wp2_cost)
      set_whitelister_phase1(whitelister_phase1)
      set_whitelister_phase2(whitelister_phase2)
      set_publicSalePhase(publicSalePhase)
      set_wp1_limit(wp1_limit)
      set_wp2_limit(wp2_limit)
      set_wp1_totalBought(wp1_totalBought)
      set_wp2_totalBought(wp2_totalBought)
      set_isWhitelister1(isWhitelister1)
      set_isWhitelister2(isWhitelister2)

      set_balance(balance)
      set_supply(supply)

      console.log("test done");
    }
  function find_totalAmount(){
    set_total_price(Number(quantity)* Number(curr_price/10**18));
  }
  
    const { switchNetwork: mint_switch } = useSwitchNetwork({
      chainId: networkId,
      // throwForSwitchChainNotSupported: true,
      onSuccess() {
        mint?.();
      },
    });
  
  
    const waitForTransaction2 = useWaitForTransaction({
      hash: stakeResult?.hash,
      onSuccess(data) {
        test?.();
        console.log("Success2", data);
      },
    });
  return (
    <div>
        <Navbar/>


        <div className=' mb-12  mt-12 border-black rounded-md  p-5 w-[50%] md:w-[35%] border  mx-auto h-auto' style={{paddingBottom:40,marginTop:50,paddingTop:50, maxWidth:500
         }} >


           <div className=' text-center  ' >
           <h2 className='  text-xl  sm:text-3xl'style={{ fontFamily:"Gemstone, sans-serif" }}>Club Ollie Collection</h2>
           </div>

            {/* <div className=' flex py-5 justify-center gap-6'>
                <div className=' days text-center'>
                    <h2 className=' '>{days}</h2>
                    <span className=' '>Days</span>
                </div>
                <div className=' hours text-center'>
                    <h2 className=' '>{hours}</h2>
                    <span className=' '>Hours</span>
                </div>
                <div className=' minutes text-center'>
                    <h2 className=' '>{minutes}</h2>
                    <span className=' '>Minutes</span>
                </div>
                <div className=' seconds text-center'>
                    <h2 className=' '>{seconds}</h2>
                    <span className=' '>Seconds</span>
                </div>
            </div> */}


            <div className=' my-4 flex justify-between items-center border border-black rounded-md p-3'>
                <div>
                    <img src={require('../../assets/images/prereveal.png')} height='40px' width="60px" className=' rounded-md'   alt='' />
                </div>
                <div>
                    <h2 className='  text-black-200 text-sm'>Price Per NFT</h2>
                    <p className='  'style={{ fontFamily:"Gemstone, sans-serif" }}>{curr_price/10**18} ETH EACH</p>
                </div>
            </div>



            <div className=' my-4 flex justify-between items-center border border-black rounded-md p-3'>
                <div>
                   <h2 className=' '>Available To Mint</h2>
                </div>
                <div>
                    
                    <p className=' '>{supply} minuted out of {maxSupply}</p>
                </div>
            </div>


            <div className=' my-4 sm:flex  block justify-between items-center border border-black rounded-md p-3'>
                <div>
                   <h2 className='   font-normal' > Mint Amount</h2>
                </div>
                <div>
                    
                    {/* <p className=' '>0 minuted out of 0</p> */}

                    <div className=' flex justify-between  rounded-sm p-1 bg-white gap-1'>
                        <div    onClick={decrement} className=' bg-[#000000] rounded-sm  w-8 flex justify-center items-center h-8'>
                            <span className=' text-white'>-</span>
                        </div>
                    <input  type='number' readOnly placeholder='1' className=' w-20 text-center' value={quantity}  />
                    <div    onClick={increment} className='bg-[#000000] rounded-sm  w-8 flex justify-center items-center h-8'>
                            <span className=' text-white'>+</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className=' my-4 flex justify-between items-center border border-black rounded-md p-3'>
                <div>
                   <h2 className='  font-normal'> Total Amount</h2>
                </div>
                <div>
                    
                    <p className=' '>{(Number(quantity)* Number(curr_price))/10**18} ETH</p>
                </div>
            </div>

           <div className=' mt-6'>
           <button className='primary-btn  w-full  text-lg' style={{ letterSpacing:2}} onClick={mintNft}>MINT NFT NOW</button>
           </div>
        </div>
    </div>
  )
}

export default Home