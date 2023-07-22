import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./CartItemCard.css"

const CartItemCard = ({item,deleteCartItems}) => {

  const navigate = useNavigate();
  const productDetailsHandler =() =>{
    navigate(`/product/${item.product}`)
  }
  return (
    <div className='CartItemCard'>
        <img src={item.image} alt="temp" onClick={productDetailsHandler} />
        <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
            <span>{`Price: $${item.price}`}</span>
            <p onClick={() => deleteCartItems(item.product)}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCard