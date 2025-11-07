import ScrollImageSequence from "@/components/ScrollImageSequence";

export default function Home() {
  return (
    <ScrollImageSequence
      imagePath="/assets/Image-testing"
      totalFrames={840}
      imagePrefix="cartier testing_"
      imageExtension="jpg"
      startFrame={0}
      zeroPadding={true}
      paddingLength={5}
    />
  );
}
