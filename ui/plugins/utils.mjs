
let metamaskWeb3 = new Web3('http://localhost:8545')
let account = null
let publicSquareContract
let publicSquareContractAddress

export function web3() {
  return metamaskWeb3
}

export const accountAddress = () => {
  return account
}

export async function setProvider() {
  if (window.ethereum){
   metamaskWeb3 = new Web3(ethereum);
    try{
   // Request account access if needed
        await ethereum.enable();
  }
   catch (error){
   // User denied account access...
   }
  } else if (window.web3){
    metamaskWeb3 = new Web3(web3.currentProvider);
  }
  account = await metamaskWeb3.eth.getAccounts()
  let id = await metamaskWeb3.eth.net.getId()
  metamaskWeb3.eth.handleRevert = true;
  publicSquareContractAddress = PublicSquareABI.networks[id]["address"]
}


function getPublicSquareContract() {
  publicSquareContract = publicSquareContract || new metamaskWeb3.eth.Contract(PublicSquareABI.abi, publicSquareContractAddress)
  return publicSquareContract;
}

export async function registerName(name) {
  await getPublicSquareContract().methods.registerName(name).send({
    from: account[0]
  })
}

export async function getMyName() {
  return await getName(accountAddress());
}

export async function getName(address) {
  return await getPublicSquareContract().methods.names(address[0]).call()
}

export async function getStatus(name) {
  let nameHash = metamaskWeb3.utils.keccak256(name)
  let citizen = await getPublicSquareContract().methods.citizens(nameHash).call()
  return citizen.status;
}

export async function getRecentPostings() {
  let postings = []
  let numberOfPostings = await getPublicSquareContract().methods.numberOfPosts().call()
  for (let i = 0; i < numberOfPostings; i++) {
    let p = await getPublicSquareContract().methods.postings(i).call();
    postings.push(p)
  }
  return postings;
}

export async function setStatus(status) {
  await getPublicSquareContract().methods.setStatus(status).send({
    from: account[0]
  })
}

export async function makePosting(message) {
  await getPublicSquareContract().methods.makePosting(message).send({
    from: account[0]
  })
}
