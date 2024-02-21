import Story from "./Story";
import Icebreaker from "./Icebreaker";
const Home = () => {
  return (
    <div className="w-full flex  align-middle bg flex-col h-screen overflow-hidden">
<Story/>
<Icebreaker/>

    
      {/* <div
        className="w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300"
        style={{ scrollbarWidth: 'thin' }}
      > */}
        
       
      </div>
    // </div>
  );
};

export default Home;
