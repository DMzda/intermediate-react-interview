import { useState, useEffect } from "react"

const apiUrl = "https://randomuser.me/api/?results=20"

const ORDER_ARROW = { default: "", ascending: "🔽", descending: "🔼" }

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
      const result = jsonData.results.map((item, index) => {
        return { ...flattenData(item.location), id: index }
      })

      setData(result)
      setHeaders(Object.keys(result[0]))
      setOrder(
        Object.keys(result[0]).reduce(
          (acc, value) => ({ ...acc, [value]: "default" }),
          {}
        )
      )
    }
    fetchData()
  }, [])

  const nextSortOrder = (columnName) => {
    if (order[columnName] === "default") {
      return "ascending"
    } else if (order[columnName] === "ascending") {
      return "descending"
    } else if (order[columnName] === "descending") {
      return "default"
    }
  }

  const handleSort = (columnName) => {
    const newSortOrder = nextSortOrder(columnName)

    setOrder({ ...order, [columnName]: newSortOrder })

    const sortedData = [...data].sort((a, b) => {
      if (newSortOrder === "default") {
        return a.id - b.id
      }

      const asc = newSortOrder === "ascending"

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
  }

  const handleColumnClick = (item) => {
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
                {item} {sortedBy === item ? ORDER_ARROW[order[item]] : ""}
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
