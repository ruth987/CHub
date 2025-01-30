import { CommunitySection } from "@/components/home/community-section";
import { CTASection } from "@/components/home/cta-section";
import ExploreBiblePlans from "@/components/home/explore-bible-plans";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { QuestionsSection } from "@/components/home/question-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    
    <main>
    <Hero />
    <Features />
    <ExploreBiblePlans />
    <QuestionsSection />
    <CommunitySection />
    <CTASection />
    <Footer />
  </main>
  );
}

