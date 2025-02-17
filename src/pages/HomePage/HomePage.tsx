import Slider from "@/components/Slider/Slider";
import SearchBar from "@/components/SearchBar/SearchBar";
import Card from "@/components/Card/Card";

const HomePage = () => {
  return (
    <div className="bg-primary min-h-screen">
      <Slider />
      <SearchBar />
      <Card />
    </div>
  );
};

export default HomePage;
