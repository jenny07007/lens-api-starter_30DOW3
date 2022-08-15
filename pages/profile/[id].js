import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { client, getProfileById, getPublicationsById } from "../../api"
import Image from "next/image"

export default function Profile(){ 
    const [profile, setProfile] = useState()
    const [pubs, setPubs] = useState([])
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        if(id){
            fetchProfile()
        }
    }, [id])

    async function fetchProfile(){
        try{
            const response = await client.query(getProfileById, { id }).toPromise()
            console.log("PROFILE:", response)
            setProfile(response.data.profile)

            const publications = await client.query(getPublicationsById, { id }).toPromise()
            console.log("PUBS!", publications)
            setPubs(publications.data.publications.items)
        } catch(error){
            console.log("ERROR:", error)
        }
    }

    return (
        <div>
            {profile && <div>
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
                </div>}

                {pubs.length > 0 && 
                <div className="py-4">
                 {pubs.map((p, index) => (
                 <div key={p.id}>
                    <p className="font-bold">{p.__typename}</p>
                    <p>{p.metadata.content}</p>
                    <p>{p.metadata.name}</p>
                </div>
                 ))}
                   
                </div>}
        </div>
    )
}

