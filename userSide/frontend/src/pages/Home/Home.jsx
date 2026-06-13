import Hero from '../../components/home/Hero/Hero';
import WhyChooseUs from '../../components/home/WhyChooseUs/WhyChooseUs';
import SignatureBowls from '../../components/home/SignatureBowls/SignatureBowls';
import StoryPreview from '../../components/home/StoryPreview/StoryPreview';
import GalleryPreview from '../../components/home/GalleryPreview/GalleryPreview';
import Testimonials from '../../components/home/Testimonials/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <SignatureBowls />
      <StoryPreview />
      {/* <GalleryPreview />
      <Testimonials /> */}
    </>
  );
}
