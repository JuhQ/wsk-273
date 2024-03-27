
const fetchRestaurants = async () => {
  const restaurantResult = await fetch("https://10.120.32.94/restaurant/api/v1/restaurants")

  const restaurants = await restaurantResult.json()

  return restaurants
}

const sortRestaurants = (restaurants) => {
  restaurants.sort((a, b) =>
    a.name
      .toLowerCase()
      .trim()
      .localeCompare(b.name.toLowerCase().trim())
  )
}

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(" ", "").replace(/[a-zA-Z-]+/g, "")

  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`
}

const createDialog = (restaurant, dialogNode) => {
  // ternary operator
  const phone = restaurant.phone !== "-" ? createPhoneLink(restaurant.phone) : ""

  dialogNode.innerHTML = `
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <p><a href="mailto:juha.tauriainen@metropolia.fi">laita mailia</a></p>

    <form method="dialog">
      <button>Sulje</button>
    </form>
  `

  dialogNode.showModal()
}

const handleTableRowClick = (tr, restaurant, dialogNode) => {
  document.querySelectorAll("tr").forEach((tr) => {
    tr.classList.remove("highlight")
  })

  tr.classList.add("highlight")

  createDialog(restaurant, dialogNode)
}

const createTable = (restaurants) => {
  const tableNode = document.querySelector("table")
  const dialogNode = document.querySelector("dialog")

  restaurants.forEach((restaurant) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `<td>${restaurant.name}</td><td>${restaurant.address}</td>`
    tableNode.appendChild(tr)

    tr.addEventListener("click", () => {
      handleTableRowClick(tr, restaurant, dialogNode)
    })
  })
}

const buildWebsite = async () => {
  // const singleRestaurant =  await fetch("https://10.120.32.94/restaurant/api/v1/restaurants/daily/6470d38ecb12107db6fe24c1/fi")

  const restaurants = await fetchRestaurants()
  sortRestaurants(restaurants)

  createTable(restaurants)
}

buildWebsite()