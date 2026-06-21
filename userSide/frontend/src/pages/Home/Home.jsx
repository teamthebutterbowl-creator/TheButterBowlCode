import { Helmet } from 'react-helmet-async';
import Hero from '../../components/home/Hero/Hero';
import WhyChooseUs from '../../components/home/WhyChooseUs/WhyChooseUs';
import SignatureBowls from '../../components/home/SignatureBowls/SignatureBowls';
import StoryPreview from '../../components/home/StoryPreview/StoryPreview';
import GalleryPreview from '../../components/home/GalleryPreview/GalleryPreview';
import Testimonials from '../../components/home/Testimonials/Testimonials';

export default function Home() {
  return (
    <>
      <Helmet>
  <title>About Butter Bowl – North Indian Cloud Kitchen</title>
  <meta name="description" content="Learn about Butter Bowl — a cloud kitchen serving fresh North Indian meals made with premium ingredients and timeless recipes." />
  <meta property="og:title" content="About Butter Bowl – Cloud Kitchen" />
  <meta property="og:description" content="Fresh North Indian meals delivered fast. Know our story." />
  <meta property="og:image" content="https://thebutterbowl.in/Image1.jpeg" />
  <meta property="og:url" content="https://thebutterbowl.in/home" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://thebutterbowl.in/home" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Butter Bowl – North Indian Cloud Kitchen" />
  <meta name="twitter:description" content="Fresh North Indian meals delivered fast. Order now from Butter Bowl." />
  <meta name="twitter:image" content="https://thebutterbowl.in/Image1.jpeg" />
</Helmet>
      <Hero />
      <WhyChooseUs />
      <SignatureBowls />
      <StoryPreview />
      {/* <GalleryPreview />
      <Testimonials /> */}
    </>
  );
}
