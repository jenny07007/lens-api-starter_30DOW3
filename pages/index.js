import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, recommendedProfiles } from "../api";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendedProfiles).toPromise();
      console.log({ response });
      setProfiles(response.data.recommendedProfiles);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div>
        {profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key={index}>
            <a>
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
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
