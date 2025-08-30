import React, { useState } from 'react';
import Table from '../components/Table';
import StatusPill from '../components/StatusPill';
import { donationOffers, drivers } from '../lib/mock';

export default function DonationsPage(){
  const [assignFor, setAssignFor] = useState(null);
  const [choice, setChoice] = useState('');
  const markCollected = (id)=> alert('Marked collected: ' + id);
  const assign = ()=> {
    if(!choice) return;
    alert(`Assigned ${choice} to ${assignFor.id}`);
    setAssignFor(null); setChoice('');
  };

  return (
    <div className="grid gap-6">
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Incoming Donations</h3>
        <Table
          columns={[
            { key: 'id', title: 'Order ID' },
            { key: 'donor', title: 'Donor' },
            { key: 'time', title: 'Arriving Time' },
            { key: 'status', title: 'Status', render:v=> <StatusPill status={v}/> },
            { key: 'id', title: 'Action', render:(v,r)=> (
              <div className="flex gap-2">
                <button className="btn border" onClick={()=>alert(JSON.stringify(r, null, 2))}>View</button>
                <button className="btn btn-primary" onClick={()=>setAssignFor(r)}>Assign Driver</button>
                <button className="btn border" onClick={()=>markCollected(r.id)}>Mark Collected</button>
              </div>
            )},
          ]}
          rows={donationOffers}
        />
      </div>

      {assignFor && (
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Assign Driver — {assignFor.id}</h4>
            <button className="btn" onClick={()=>setAssignFor(null)}>Close</button>
          </div>
          <select
            className="mt-3 w-full border rounded-2xl px-3 py-2"
            value={choice}
            onChange={(e)=>setChoice(e.target.value)}
          >
            <option value="">Choose driver</option>
            {drivers.filter(d=>d.district===assignFor.district)
              .map(d=> <option key={d.id}>{`${d.name} (${d.vehicle})`}</option>)}
          </select>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={assign}>Assign</button>
          </div>
        </div>
      )}
    </div>
  );
}
