import { useState, useEffect } from "react"

const apiUrl = "https://randomuser.me/api/?results=20"

const flattenData = (toFlatten) => {
  let result = {}
  for (const key in toFlatten) {
    const item = toFlatten[key]
    if (typeof item === "object") {
      result = { ...result, ...item }
    } else {
      result[key] = item
    }
  }

  return result
}

const App = () => {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [order, setOrder] = useState({})
  const [sortedBy, setSortedBy] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl)

      const jsonData = await response.json()
      console.log(jsonData)
      const result = jsonData.results.map((item) => flattenData(item.location))
      console.log(result)
      setData(result)
      setHeaders(Object.keys(result[0]))
      setOrder(
        Object.keys(result[0]).reduce(
          (acc, value) => ({ ...acc, [value]: true }),
          {}
        )
      )
    }
    fetchData()
  }, [])

  const handleSort = (columnName) => {
    const asc = order[columnName]
    order[columnName] = !asc
    console.log(data)

    const sortedData = [...data].sort((a, b) => {
      const nameA = a[columnName]
      const nameB = b[columnName]
      if (nameA < nameB) {
        return asc ? -1 : 1
      }
      if (nameA > nameB) {
        return asc ? 1 : -1
      }
      return 0
    })
    setData(sortedData)
    console.log(sortedData)
  }

  const handleColumnClick = (item) => {
    console.log(item)
    handleSort(item)
    setSortedBy(item)
  }

  return (
    <div className="container">
      <h1>Addresses</h1>
      <table>
        <thead>
          <tr>
            {headers.map((item) => (
              <th key={item} onClick={() => handleColumnClick(item)}>
                {item} {sortedBy === item ? (order[item] ? "🔽" : "🔼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.number + item.postcode}>
              {headers.map((header) => (
                <td key={header}>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
