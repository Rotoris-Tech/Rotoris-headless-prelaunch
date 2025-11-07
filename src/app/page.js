import ScrollImageSequence from "@/components/ScrollImageSequence";

export default function Home() {
  return (
    <div className="w-full bg-white dark:bg-black" style={{ margin: 0, padding: 0 }}>
      <ScrollImageSequence
        imagePath="/assets/Image-testing"
        totalFrames={840}
        imagePrefix="cartier testing_"
        imageExtension="jpg"
        startFrame={0}
        zeroPadding={true}
        paddingLength={5}
        className="w-full"
      />
    </div>
  );
}
