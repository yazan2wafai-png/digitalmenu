"use client";

import React, { useState, useEffect, useCallback } from "react";

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

  const fetchLocations = useCallback(async () => {
    if (!slug) return;
    setIsLoadingLocations(true);
    try {
      const res = await fetch(`/api/proxy/admin/restaurants/${slug}/locations`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
        if (data.length > 0 && !selectedLocationId) {
          setSelectedLocationId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLocations(false);
    }
  }, [slug, selectedLocationId]);

  const fetchTables = useCallback(async (locationId: string) => {
    setIsLoadingTables(true);
    try {
      const res = await fetch(`/api/proxy/admin/locations/${locationId}/tables`);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (selectedLocationId) {
      fetchTables(selectedLocationId);
    } else {
      setTables([]);
    }
  }, [selectedLocationId, fetchTables]);

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
    if (!confirm("Are you sure? This will delete the location and all its tables.")) return;
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
    if (typeof window !== "undefined") {
      const host = window.location.host;
      if (host.includes("localhost")) {
        return `http://${slug}.localhost:3000/t/${tableId}`;
      }
    }
    return `https://${slug}.nfcmyplace.com/t/${tableId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-8 text-gray-900">
      {/* Locations Column */}
      <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Locations</h2>
          <button 
            className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
            onClick={() => {
              setEditingLocation(null);
              setLocationForm({ name: "", address: "" });
              setShowLocationModal(true);
            }}
          >
            + Add Location
          </button>
        </div>

        {isLoadingLocations ? (
          <p className="text-gray-500 text-sm">Loading locations...</p>
        ) : locations.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No locations found. Add your first location.</p>
        ) : (
          <ul className="space-y-2">
            {locations.map(loc => (
              <li 
                key={loc.id} 
                className={`p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  selectedLocationId === loc.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocationId(loc.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{loc.name}</div>
                    {loc.address && <div className="text-xs text-gray-500 mt-0.5">{loc.address}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="text-xs text-blue-600 hover:underline px-2 py-1"
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
                      className="text-xs text-red-600 hover:underline px-2 py-1"
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
      <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tables</h2>
          <button 
            className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
            disabled={!selectedLocationId}
            onClick={() => {
              setEditingTable(null);
              setTableForm({ name: "" });
              setShowTableModal(true);
            }}
          >
            + Add Table
          </button>
        </div>

        {!selectedLocationId ? (
          <p className="text-gray-500 text-sm py-4">Select a location on the left to view tables.</p>
        ) : isLoadingTables ? (
          <p className="text-gray-500 text-sm">Loading tables...</p>
        ) : tables.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No tables found for this location.</p>
        ) : (
          <ul className="space-y-3">
            {tables.map(table => {
              const url = getTableUrl(table.id);
              return (
                <li key={table.id} className="p-3.5 border border-gray-200 rounded-xl bg-gray-50/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-gray-800">{table.name}</div>
                    <div className="flex gap-2">
                      <button 
                        className="text-xs text-blue-600 hover:underline px-2 py-0.5"
                        onClick={() => {
                          setEditingTable(table);
                          setTableForm({ name: table.name });
                          setShowTableModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-xs text-red-600 hover:underline px-2 py-0.5"
                        onClick={() => handleDeleteTable(table.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg border border-gray-200 text-xs break-all">
                    <span className="flex-1 text-gray-700 font-mono">{url}</span>
                    <button 
                      className="text-gray-700 hover:text-black px-2.5 py-1 border border-gray-300 rounded bg-gray-50 shrink-0 cursor-pointer"
                      onClick={() => copyToClipboard(url)}
                    >
                      Copy
                    </button>
                    <button 
                      className="text-blue-700 hover:text-blue-900 px-2.5 py-1 border border-blue-200 rounded bg-blue-50 shrink-0 font-medium cursor-pointer"
                      onClick={() => setShowQrModal(table)}
                    >
                      QR Code
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-gray-900">
            <h3 className="text-lg font-bold mb-4">{editingLocation ? "Edit Location" : "Add Location"}</h3>
            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input 
                  required
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={locationForm.name}
                  onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="e.g. Main Dining Room"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Address / Description</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={locationForm.address}
                  onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="e.g. Ground Floor, Terrace"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-gray-900">
            <h3 className="text-lg font-bold mb-4">{editingTable ? "Edit Table" : "Add Table"}</h3>
            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Table Name/Number</label>
                <input 
                  required
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tableForm.name}
                  onChange={e => setTableForm({ ...tableForm, name: e.target.value })}
                  placeholder="e.g. Table 1, T-12, Booth 3"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setShowTableModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center text-center shadow-xl text-gray-900">
            <h3 className="text-lg font-bold mb-1 text-gray-800">QR Code</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">{showQrModal.name}</p>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getTableUrl(showQrModal.id))}`}
                alt="Table QR Code"
                width={200}
                height={200}
                className="rounded"
              />
            </div>

            <p className="text-xs text-gray-500 mb-4 font-mono break-all px-2">{getTableUrl(showQrModal.id)}</p>
            
            <div className="flex w-full gap-2">
              <button 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer text-sm"
                onClick={() => copyToClipboard(getTableUrl(showQrModal.id))}
              >
                Copy Link
              </button>
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer text-sm"
                onClick={() => setShowQrModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
