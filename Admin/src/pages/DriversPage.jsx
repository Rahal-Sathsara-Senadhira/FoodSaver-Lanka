import React from 'react';
import Table from '../components/Table';
import { drivers } from '../lib/mock';

export default function DriversPage(){
  return (
    <div className="grid gap-6">
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Volunteer Drivers</h3>
        <Table
          columns={[
            {key:'name',title:'Name'},
            {key:'vehicle',title:'Vehicle'},
            {key:'district',title:'District'},
            {key:'status',title:'Status'},
            {key:'id',title:'Action',render:(v,r)=> (
              <div className="flex gap-2">
                <button className="btn border">Message</button>
                <button className="btn btn-primary">Assign</button>
              </div>
            )},
          ]}
          rows={drivers}
        />
      </div>
    </div>
  );
}
