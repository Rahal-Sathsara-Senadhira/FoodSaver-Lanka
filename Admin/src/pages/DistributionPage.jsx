import React from 'react';
import Table from '../components/Table';
import { distributionBatches } from '../lib/mock';

export default function DistributionPage(){
  const markDelivered = (r)=> alert('Delivered ' + r.id);
  return (
    <div className="grid gap-6">
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Distribution Batches (to Shelters)</h3>
        <Table
          columns={[
            {key:'id',title:'Batch'},
            {key:'ngo',title:'NGO Request'},
            {key:'items',title:'Packages'},
            {key:'destination',title:'Destination'},
            {key:'status',title:'Status'},
            {key:'driver',title:'Driver',render:(v)=> v || <span className="text-slate-400">Unassigned</span>},
            {key:'id',title:'Action',render:(v,r)=>(
              <div className="flex gap-2">
                <button className="btn border">Assign Driver</button>
                <button className="btn btn-primary" onClick={()=>markDelivered(r)}>Mark Delivered</button>
              </div>
            )},
          ]}
          rows={distributionBatches}
        />
      </div>
    </div>
  );
}
