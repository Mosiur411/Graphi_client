import React, { useState, useEffect } from 'react'
import { Bar, Line } from "react-chartjs-2";
import 'chartjs-plugin-dragdata'


export default function SimpleLineChart(props) {

    const [Data, setData] = useState([])
    const [dataisLoaded, setdataisLoaded] = useState(false)

    const [shouldRedraw] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);


    const buildDataSet = (data) => {
        let labels = data?.map(c => c.label);
        var options = {
            type: labels,
            data: {
                labels: labels,
                borderColor: "#fffff",
                datasets: [{
                    label: 'Graph',
                    yAxisID: 'y',
                    borderColor: 'rgb(75, 192, 192)',
                    data: data?.map(c => c.yValue),
                    pointHitRadius: 25
                }]
            },
            backgroundColor: "rgba(75,99,132)",
            options: {
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        max: 100,
                        min: 0
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        max: 1,
                        min: 0
                    }
                },
                onHover: function (e) {
                    const point = e.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                    if (point.length) e.native.target.style.cursor = 'grab'
                    else e.native.target.style.cursor = 'default'
                },
                plugins: {
                    backgroundImage: {
                        url: 'https://i.imgur.com/bQcg21b.jpg'
                    },
                    dragData: {
                        backgroundImage: {
                            url: 'https://i.imgur.com/bQcg21b.jpg'
                        },
                        round: 2,
                        showTooltip: true,
                        onDragStart: function (e) {
                            // console.log(e)
                        },
                        onDrag: function (e, datasetIndex, index, value) {
                            e.target.style.cursor = 'grabbing'
                            // console.log(e, datasetIndex, index, value)
                        },
                        onDragEnd: function (e, datasetIndex, index, value) {
                            e.target.style.cursor = 'default'
                            // console.log(datasetIndex, index, value)
                        },
                    }
                }
            }
        }
        return options;
    }


    let localOption = buildDataSet(Data);


    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true)
        }, 200);
    }, [])
    /* ===================== Data grt =========  */
    useEffect(() => {
        fetch('https://intense-river-05869.herokuapp.com/api/v1/grap/simpleLine', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data?.data)
            })

    }, [dataisLoaded])

    /* ===================== Data Delete =========  */
    const [Delete, setDelete] = useState()
    if (Delete) {
        const id = Delete;
        fetch(`https://intense-river-05869.herokuapp.com/api/v1/grap/simpleLine/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setdataisLoaded(!dataisLoaded)
                }
            })
    }



    /* ===================== Data Post =========  */
    const [label, setlabel] = useState('')
    const [yValue, setaValue] = useState(0)
    const submitPost = (label, yValue) => {
        if (label && yValue) {
            const Data = { label: label, yValue: yValue }
            fetch('https://intense-river-05869.herokuapp.com/api/v1/grap/simpleLine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Data),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        setdataisLoaded(!dataisLoaded)
                    }
                })

        }
    }
    return (
        <div className=' h-full flex justify-center items-center'>
            <div className='   mx-10 w-10/12 '>

                <div className=' w-full'>
                    <div className=' flex items-center justify-between gap-6'>
                        <div className=' flex flex-col w-full my-10 md:my-0 md:w-[50%] p-5 rounded-md shadow-md xl:px-10'>
                            <h1 className=' text-purple-800 font-semibold '>Add Your Graph</h1>
                            <hr className='mb-4 mt-1 bg-purple-800 h-[1.5px] w-1/2 flex mx-auto' />
                            <input onBlur={(e) => setlabel(e.target.value)} type="text" placeholder='Names' className='bg-gray-100 px-3 py-1 rounded shadow-md' />

                            <input onBlur={(e) => setaValue(e.target.value)} type="number" placeholder='Number' className='bg-gray-100 mt-4 px-3 py-1 rounded shadow-md' />

                            <button onClick={() => submitPost(label, yValue)} type="button" class="inline-block px-3 py-2 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out  mx-auto mt-5">Submit</button>
                        </div>
                        {/* ============ ============= */}
                        <div className=' bg-white w-full md:w-[50%]  h-[13rem] rounded-md shadow-md overflow-auto py-5 px-5'>
                            {
                                Data.map(data => <div className=' bg-white mb-5 flex justify-between items-center px-5 py-1 rounded shadow-md ' key={data._id}>
                                    <p className=' font-medium'>{data.label}</p>
                                    <p>{data.yValue}</p>
                                    <p onClick={() => setDelete(data._id)} className='text-white cursor-pointer px-[6px] border-2 bg-red-400 rounded'>X</p>

                                </div>)
                            }
                        </div>
                    </div>
                    <div className='w-full bg-white mt-8 md:p-5 p-1 mb-10 md:my-0 rounded-md shadow-md'>
                        {isLoaded &&
                            <Line
                                redraw={shouldRedraw}
                                data={localOption.data}
                                options={localOption.options}
                                plugins={localOption.plugins}
                                fillStyle='lightGreen'
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}
