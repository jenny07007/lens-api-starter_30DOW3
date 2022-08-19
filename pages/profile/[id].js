import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfileById, getPublicationsById } from "../../api";
import Image from "next/image";
import ABI from "../../abi.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await client.query(getProfileById, { id }).toPromise();
      console.log("PROFILE:", response);
      setProfile(response.data.profile);

      const publications = await client
        .query(getPublicationsById, { id })
        .toPromise();
      console.log("PUBS!", publications);
      setPubs(publications.data.publications.items);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("accounts: ", accounts);
  }

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, ABI, signer);

    try {
      const tx = await contract.follow([id], [0x0]);
      await tx.wait();
      console.log("Followed user successfully");
    } catch (err) {
      console.log("Failed to follow user due to", err);
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect</button>
      {profile && (
        <div>
          {profile.picture && profile.picture.original ? (
            <Image
              src={profile.picture.original.url}
              width="52px"
              height="52px"
              alt={profile.handle}
            />
          ) : (
            <div className="bg-gray-100" />
          )}
          <p>{profile.handle}</p>
          <p>{profile.bio}</p>
          <p>Followers: {profile.stats.totalFollowers}</p>
          <p>Following: {profile.stats.totalFollowing}</p>
          <button onClick={followUser}>Follow</button>
        </div>
      )}

      {pubs.length > 0 && (
        <div className="py-4">
          {pubs.map((p, index) => (
            <div key={p.id}>
              <p className="font-bold">{p.__typename}</p>
              <p>{p.metadata.content}</p>
              <p>{p.metadata.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
