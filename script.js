
const CONTRACT_ADDRESS = 'PASTE_YOUR_CONTRACT_ADDRESS';
const ABI = [
  "function mint(string memory tokenURI) public payable",
  "function mintPrice() public view returns (uint256)"
];

const NFTS = [
  {
    name: "Hero #1",
    image: "https://ipfs.io/ipfs/Qm...1",
    metadata: "ipfs://Qm...1"
  },
  {
    name: "Hero #2",
    image: "https://ipfs.io/ipfs/Qm...2",
    metadata: "ipfs://Qm...2"
  }
];

let provider, signer, contract;

async function connectWallet() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = "Connected: " + address;
}

function renderGallery() {
  const gallery = document.getElementById("nftGallery");
  NFTS.forEach(nft => {
    const div = document.createElement("div");
    div.className = "nft";
    div.innerHTML = `
      <img src="${nft.image}" alt="${nft.name}" />
      <h3>${nft.name}</h3>
      <button onclick="mintNFT('${nft.metadata}')">Mint for 0.01 ETH</button>
    `;
    gallery.appendChild(div);
  });
}

async function mintNFT(uri) {
  try {
    const tx = await contract.mint(uri, { value: ethers.utils.parseEther("0.01") });
    await tx.wait();
    alert("NFT minted!");
  } catch (err) {
    console.error(err);
    alert("Minting failed");
  }
}

window.onload = renderGallery;
