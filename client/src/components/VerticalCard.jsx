import React from 'react'
import { Table, Button } from 'flowbite-react';
import { Link } from 'react-router-dom'

const VerticalCard = ({heading,colOne,colTwo,list}) => {
    return (
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className='text-center p-2'>{heading}</h1>
                <Button outline gradientDueTone='purpleToPink'>
                    <Link to={'/dashboard?tab=users'}>See All</Link>
                </Button>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>{colOne}</Table.HeadCell>
                    <Table.HeadCell>{colTwo}</Table.HeadCell>
                </Table.Head>
                {list &&
                    list.map((item) => (
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <img src={item.profilePicture} alt="user" />
                                </Table.Cell>
                                <Table.Cell>{item.username}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))
                }
            </Table>
        </div>
    )
}

export default VerticalCard