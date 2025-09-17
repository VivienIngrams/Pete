import Image from "next/image";
import { readToken } from "~/sanity/lib/sanity.api";
import { getVideos } from "~/sanity/lib/sanity.queries";
import { getClient } from "~/sanity/lib/sanity.client";

const StaticVideos = async () => {
  const client = getClient({ token: readToken });
  const videos = await getVideos(client, {
    next: {
      revalidate: 60,
    },
  });


  // Ensure `videos` is an array, or initialize it as an empty array
  const safeVideos = Array.isArray(videos) ? videos : [];
  
  // Add the problematic video manually
  const hardcodedVideo = {
    videoId: "1NGeiLDDWzo",
    title: "Hypnokinetic",
  };

  const allVideos = [...safeVideos, hardcodedVideo];

  return (
    <div className="min-h-screen py-24 w-full xl:w-[85vw] font-cinzel mx-auto flex flex-col items-center justify-center gap-y-8">
      <h1
        className="relative text-2xl xl:text-4xl w-full text-left pl-8 xl:pl-16"
        style={{ zIndex: 50 }}
      >
        Videos
      </h1>
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-y-8">
        {allVideos.map((video, index) => {
          return (
            <a
              href={`https://youtu.be/${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="flex flex-col items-center"
            >
              <div className="relative w-[300px] h-[200px] xl:w-[550px] xl:h-[350px] overflow-hidden shadow-lg shadow-gray-800">
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover xl:px-0"
                  width={300}
                  height={200}
                />
              </div>
              <p className="mt-2 text-gray-500 text-center text-lg lg:text-xl">
                {video.title}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default StaticVideos;
