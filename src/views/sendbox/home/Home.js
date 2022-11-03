import React from 'react'
import { Button } from 'antd'
import axios from 'axios'

export default function Home() {
    function ajax() {
        //get data
        // axios.get("http://localhost:8000/posts").then(res => {
        //     console.log(res.data);
        // })

        //post data
        // axios.post("http://localhost:8000/posts", {
        //     title: "food vlog",
        //     author: 'Owen Chen'
        // })

        //update data (put)
        //              axios.put("http://localhost:8000/posts/1", {
        //     title: "mountain trip",
        //     author: 'Leo Wang'
        // })   

        //update data (patch)
        // axios.patch("http://localhost:8000/posts/1", {
        //     title: "mountain trip",
        //     author: 'Leo Wang'
        // })

        //delete data
        // axios.delete("http://localhost:8000/posts/1")

        //_embed
        // axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
        //     console.log(res.data);
        // })

        //_expand
        // axios.get("http://localhost:8000/comments?_expand=post").then(res => {
        //     console.log(res.data);
        // })
    }

    return (
        <div>
            <Button type='primary'
                onClick={ajax}
            >
                Button
            </Button>
        </div>
    )
}
