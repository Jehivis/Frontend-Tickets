import React from 'react';
import dateFormat from 'dateformat'
//Funciones
//import { deleteDataSales } from '../../../functions/salesFunctions'
const TableCertificates = ({ posts, loading }) => {
  if (loading) {
    return (
        <tr><td colSpan="12"><center>Cargando Datos...</center></td></tr>
    )
  }

  return (
    posts.length>0?(
        posts.map((post, i) => (
          <tr key={i}>
            <td>{post.no_cer}</td>
            <td>{post.name_cer}</td>
            <td>{post.val_cer}</td>
            <td>{dateFormat(post.date_start_cer, 'dd/mm/yyyy')}</td>
            <td>{dateFormat(post.date_end_cer, 'dd/mm/yyyy')}</td>
            <td>{post.obs_cer}</td>
            <td>{post.meatpack != null? post.meatpack : 'Sin asignar'}</td>
            <td>{post.sperry != null? post.sperry : 'Sin asignar'}</td>
            <td>{post.quiksilver != null? post.quiksilver : 'Sin asignar'}</td>
            <td>{post.guess != null? post.guess : 'Sin asignar'}</td>
            <td>{post.colehaan != null? post.colehaan : 'Sin asignar'}</td>
            <td>{post.diesel != null? post.diesel : 'Sin asignar'}</td>
          </tr>
        ))
    ):(
        <tr><td colSpan="12"><center>No existen datos</center></td></tr>
    )
  );
};

export default TableCertificates;