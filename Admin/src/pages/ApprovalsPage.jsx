import React from 'react';
import Table from '../components/Table';
import { pendingNGOs, pendingDonors, pendingVolunteers } from '../lib/mock';

export default function ApprovalsPage(){
  const approve = (kind, r)=> alert(`Approved ${kind}: ${r.name}`);
  const reject  = (kind, r)=> alert(`Rejected ${kind}: ${r.name}`);
  return (
    <div className="grid gap-6">
      <div className="card p-5">
        <h3 className="font-semibold mb-2">NGOs</h3>
        <Table
          columns={[
            {key:'name',title:'Name'},
            {key:'district',title:'District'},
            {key:'contact',title:'Contact'},
            {key:'id',title:'Action',render:(v,r)=>(
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={()=>approve('NGO',r)}>Approve</button>
                <button className="btn border border-red-300 hover:bg-red-50" onClick={()=>reject('NGO',r)}>Reject</button>
              </div>
            )},
          ]}
          rows={pendingNGOs}
        />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-2">Donors</h3>
        <Table
          columns={[
            {key:'name',title:'Name'},
            {key:'type',title:'Type'},
            {key:'contact',title:'Contact'},
            {key:'id',title:'Action',render:(v,r)=>(
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={()=>approve('Donor',r)}>Approve</button>
                <button className="btn border border-red-300 hover:bg-red-50" onClick={()=>reject('Donor',r)}>Reject</button>
              </div>
            )},
          ]}
          rows={pendingDonors}
        />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-2">Volunteer Drivers</h3>
        <Table
          columns={[
            {key:'name',title:'Name'},
            {key:'vehicle',title:'Vehicle'},
            {key:'district',title:'District'},
            {key:'phone',title:'Phone'},
            {key:'id',title:'Action',render:(v,r)=>(
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={()=>approve('Driver',r)}>Approve</button>
                <button className="btn border border-red-300 hover:bg-red-50" onClick={()=>reject('Driver',r)}>Reject</button>
              </div>
            )},
          ]}
          rows={pendingVolunteers}
        />
      </div>
    </div>
  );
}
