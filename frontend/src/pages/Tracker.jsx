import defaultChar from '../assets/default-character.png';
const Tracker = () => {

    return (
        <div className="flex-grow flex flex-box flex-col justify-between bg-orange-200 h-[100dvh]">
            <div>
                <div className="flex flex-row max-w-[400px] p-5 border rounded-lg border-orange-100 bg-orange-300 items-center mx-auto">
                    <div className="min-h-20 flex items-center justify-center">
                        <img src={defaultChar} className='h-auto'/>
                    </div>
                    <div className="p-3 flex flex-col items-center w-full">
                        <div className="flex flex-row justify-between w-full items-center text-lg">
                            charName
                            <button className='bg-black'>
                                edit button
                            </button>
                        </div>
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Class:</strong>
                                <p>N/A</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Weekly Mesos:</strong>
                                <p>0</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Level:</strong>
                                <p>0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );

};

export default Tracker;