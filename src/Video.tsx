import ReactPlayer from "react-player";

export default function Video(props: { url: string }) {
  return (
    <ReactPlayer
      playing
      loop
      muted
      controls
      url={props.url}
      width="100%"
      height="auto"
      style={{
        marginTop: "1em",
        marginBottom: "1em",
        // fixes weird extra bottom margin around videos
        display: "flex",
      }}
    />
  );
}
