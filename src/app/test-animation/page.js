import ScrollImageSequence from "@/components/ScrollImageSequence";

export const metadata = {
  title: "Animation Test - Rotoris",
  description: "Testing scroll animation with Cartier sequence",
};

export default function TestAnimation() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
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
