'use client';

function Page() {

  const tmdb_id = "tt0182576"; // Replace with actual TMDB ID
  const season_number = "1"; // Replace with actual season number
  const episode_number = "1"; // Replace with actual episode number


  return (
    <div>
      <h1>Family Guy Sleep Client</h1>
      <p>Loading video...</p>
      <iframe src={`https://vidsrc.xyz/embed/tv/${tmdb_id}/${season_number}-${episode_number}?autoplay=1&autonext=1`}></iframe>
    </div>
  );
}


export default Page;
