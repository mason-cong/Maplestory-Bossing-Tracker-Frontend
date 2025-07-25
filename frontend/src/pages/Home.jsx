import mesochair from '../assets/home-img.png';

const Home = () => {
    
    return (
        <div className="flex flex-row items-center text-center">
            <div className="inline-block mt-[3rem] p-5 mx-auto">
                <p className="text-5xl relative p-5 rounded-lg mb-[2rem]">
                    A tool to keep count of your weekly mesos.
                </p>
                <button type="button" className="text-2xl p-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white">
                    Login Now
                </button>
                
            </div>
            <div className="flex flex-end lg:flex-col">
                <img class="w-[50rem] object-fill" src={mesochair}/>
            </div>
            
        </div>
    );

};

export default Home;