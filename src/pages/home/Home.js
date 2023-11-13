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

    const networkId = 1;




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
  
  
  
    
    async function mintNft() {


      if(whitelister_phase1)
      {
        console.log("phase 1");
        if(!isWhitelister1)
        {
          alert("You are not a Whitelister");
          return;
        }
        if(wp1_totalBought>0)
        {
          alert("You have minted! You cant't mint more than 2 NFT");
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
          alert("You cant't mint more than 4 NFT");
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
      console.log("work");

      if (chain.id != networkId) {
        mint_switch?.();
      } else {
        console.log("curr proof "+curr_proof);
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
      const web3= new Web3(new Web3.providers.HttpProvider("https://ethereum.publicnode.com	"));
    
      val = web3.utils.toWei(val.toString(), "ether");
      return val;
    }
  
    async function test() 
    {
  
      const web3= new Web3(new Web3.providers.HttpProvider("https://ethereum.publicnode.com	"));
  
  
      const balance = await web3.eth.getBalance(address);
      const contract = new web3.eth.Contract(cont_abi, cont_add);
      console.log("object1");
      let isWhitelister1;
      let isWhitelister2;
      let supply = await contract.methods.totalSupply().call();
      console.log("object1");

      let public_cost = await contract.methods.pp_cost().call();
      let wp2_cost = await contract.methods.wp2_cost().call();

      let whitelister_phase1 = await contract.methods.whitelister_phase1().call();  
      let whitelister_phase2 = await contract.methods.whitelister_phase2().call();  
      let publicSalePhase = await contract.methods.publicSalePhase().call();  
      console.log("object2");

      let wp1_limit = await contract.methods.wp1_limit().call();  
      let wp2_limit = await contract.methods.wp2_limit().call();   
      console.log("object3");

      let wp1_totalBought = await contract.methods.wp1(address).call();  
      let wp2_totalBought = await contract.methods.wp2(address).call();
      // let currentTime = await contract.methods.curr_time().call();  
      
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


        set_curr_proof(res0.data)

      }
      else if(whitelister_phase2)
      {

        const res0 =await axios.get("https://merkletreeapi-production-eedc.up.railway.app/proof2?"+ new URLSearchParams({
          userAddress: address}));
         isWhitelister2 = await contract.methods.isValid2(res0.data,address).call({from : address});  

        set_curr_proof(res0.data)
        set_curr_price(wp2_cost)

      }
      else if(publicSalePhase)
      {
        // set_curr_proof(proof2)
        set_curr_price(public_cost)


      }
  
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