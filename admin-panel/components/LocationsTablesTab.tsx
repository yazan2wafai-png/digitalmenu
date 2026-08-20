"use client";

import React, { useState, useEffect } from "react";

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface Table {
  id: string;
  name: string;
  locationId: string;
}

export default function LocationsTablesTab({ slug }: { slug: string }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [showQrModal, setShowQrModal] = useState<Table | null>(null);

  // Forms
  const [locationForm, setLocationForm] = useState({ name: "", address: "" });
  const [tableForm, setTableForm] = useState({ name: "" });

  useEffect(() => {
    fetchLocations();
  }, [slug]);

  useEffect(() => {
    if (selectedLocationId) {
      fetchTables(selectedLocationId);
    } else {
      setTables([]);
    }
  }, [selectedLocationId]);

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const res = await fetch(`/api/proxy/admin/restaurants/${slug}/locations`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingLocations(false);
  };

  const fetchTables = async (locationId: string) => {
    setIsLoadingTables(true);
    try {
      const res = await fetch(`/api/proxy/admin/locations/${locationId}/tables`);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingTables(false);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingLocation ? "PATCH" : "POST";
      const url = editingLocation 
        ? `/api/proxy/admin/locations/${editingLocation.id}`
        : `/api/proxy/admin/restaurants/${slug}/locations`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationForm),
      });

      if (res.ok) {
        fetchLocations();
        setShowLocationModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/proxy/admin/locations/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedLocationId === id) setSelectedLocationId(null);
        fetchLocations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId) return;
    try {
      const method = editingTable ? "PATCH" : "POST";
      const url = editingTable 
        ? `/api/proxy/admin/tables/${editingTable.id}`
        : `/api/proxy/admin/locations/${selectedLocationId}/tables`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableForm),
      });

      if (res.ok) {
        fetchTables(selectedLocationId);
        setShowTableModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/proxy/admin/tables/${id}`, { method: "DELETE" });
      if (res.ok && selectedLocationId) {
        fetchTables(selectedLocationId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getTableUrl = (tableId: string) => {
    // Determine the base based on window location or default to slug.nfcmyplace.com
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return `http://localhost:3000/${slug}/t/${tableId}`;
    }
    return `https://${slug}.nfcmyplace.com/t/${tableId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-8">
      {/* Locations Column */}
      <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Locations</h2>
          <button 
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            onClick={() => {
              setEditingLocation(null);
              setLocationForm({ name: "", address: "" });
              setShowLocationModal(true);
            }}
          >
            Add Location
          </button>
        </div>

        {isLoadingLocations ? (
          <p>Loading locations...</p>
        ) : locations.length === 0 ? (
          <p className="text-gray-500">No locations found.</p>
        ) : (
          <ul className="space-y-2">
            {locations.map(loc => (
              <li 
                key={loc.id} 
                className={`p-3 border rounded cursor-pointer transition-colors ${selectedLocationId === loc.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedLocationId(loc.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{loc.name}</div>
                    {loc.address && <div className="text-sm text-gray-500">{loc.address}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="text-sm text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLocation(loc);
                        setLocationForm({ name: loc.name, address: loc.address || "" });
                        setShowLocationModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-sm text-red-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLocation(loc.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tables Column */}
      <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tables</h2>
          <button 
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={!selectedLocationId}
            onClick={() => {
              setEditingTable(null);
              setTableForm({ name: "" });
              setShowTableModal(true);
            }}
          >
            Add Table
          </button>
        </div>

        {!selectedLocationId ? (
          <p className="text-gray-500">Select a location to view tables.</p>
        ) : isLoadingTables ? (
          <p>Loading tables...</p>
        ) : tables.length === 0 ? (
          <p className="text-gray-500">No tables found for this location.</p>
        ) : (
          <ul className="space-y-4">
            {tables.map(table => {
              const url = getTableUrl(table.id);
              return (
                <li key={table.id} className="p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{table.name}</div>
                    <div className="flex gap-2">
                      <button 
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => {
                          setEditingTable(table);
                          setTableForm({ name: table.name });
                          setShowTableModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleDeleteTable(table.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded text-sm break-all">
                    <span className="flex-1 text-gray-700">{url}</span>
                    <button 
                      className="text-gray-600 hover:text-black px-2 py-1 border rounded bg-white shrink-0"
                      onClick={() => copyToClipboard(url)}
                    >
                      Copy
                    </button>
                    <button 
                      className="text-gray-600 hover:text-black px-2 py-1 border rounded bg-white shrink-0"
                      onClick={() => setShowQrModal(table)}
                    >
                      QR
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingLocation ? "Edit Location" : "Add Location"}</h3>
            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  required
                  type="text"
                  className="w-full border p-2 rounded"
                  value={locationForm.name}
                  onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={locationForm.address}
                  onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-600 border rounded"
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingTable ? "Edit Table" : "Add Table"}</h3>
            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Table Name/Number</label>
                <input 
                  required
                  type="text"
                  className="w-full border p-2 rounded"
                  value={tableForm.name}
                  onChange={e => setTableForm({ ...tableForm, name: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-600 border rounded"
                  onClick={() => setShowTableModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-2">QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">{showQrModal.name}</p>
            
            <div className="bg-white p-4 rounded-lg border mb-6">
              {/* Using a reliable external QR generator API since we cannot easily install libraries without prompts */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getTableUrl(showQrModal.id))}`}
                alt="Table QR Code"
                width={200}
                height={200}
              />
            </div>
            
            <button 
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setShowQrModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
