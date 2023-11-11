const keccak256 = require('keccak256')
var fs = require("fs");

const { MerkleTree } = require('merkletreejs')

function merk1()
{
    let addresses=[];
    const data=fs.readFileSync('src/backend/WL1.txt', 'utf8');

    data.split(/\r?\n/).forEach(line =>  {
        addresses.push(line.trim());
           });    
    const leaves = addresses.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    const buf2hex = x => '0x' + x.toString('hex')
    
    console.log(buf2hex(tree.getRoot()))
    
    const leaf = keccak256("0x952F3C482D3A7Ff3B6dEFC6b40DB7B9A0580a0B7") 
    const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
    console.log(proof);
    console.log(buf2hex(leaf));

}
function merk2()
{   
    let addresses=[];
    const data=fs.readFileSync('src/backend/WL2.txt', 'utf8');

    data.split(/\r?\n/).forEach(line =>  {
        addresses.push(line.trim());
           }); 
    // console.log("here it is "+addresses.length);

    const leaves = addresses.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    const buf2hex = x => '0x' + x.toString('hex')
    
    console.log(buf2hex(tree.getRoot()))
    
    const leaf = keccak256("0xdEeD41183d70d39ad9eD44819B356271336E3CE9") 
    const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
    console.log(proof);
}

merk1();
merk2();

