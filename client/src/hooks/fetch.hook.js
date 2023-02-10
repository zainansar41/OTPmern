import axios from "axios";
import { useEffect, useState } from "react";
import { getUSerName } from '../helper/helper'

axios.defaults.baseURL = "http://localhost:8080"


//custom hook
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))
                const { username } = !query ? await getUSerName() : '';
                const { data, status } = !query ? await axios.get(`api/user/${username}`) : await axios.get(`/api/${query}`)

                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    apiData: data,
                    status: status,
                    serverError: null
                }))
            } catch (error) {
                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    serverError: error
                }))
            }
        }
        fetchData()
    }, [query])

    return [getData, setData]
}
