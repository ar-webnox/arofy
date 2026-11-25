import { Header } from "@/components/header";
import { StudioProvider, Hero, Workspace, Popular, Presets } from "@/components/studio";
import { HowItWorks, About, Faq, Footer } from "@/components/content";

export default function Home() {
  return (
    <StudioProvider>
      <Header />
      <main>
        <Hero /><Workspace /><Popular /><Presets /><HowItWorks /><About /><Faq />
      </main>
      <Footer />
    </StudioProvider>
  );
}
