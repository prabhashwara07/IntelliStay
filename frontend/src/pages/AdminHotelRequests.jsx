import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Star,
  Building2,
  Calendar,
  User,
  Loader2
} from 'lucide-react';

import { 
  useApproveHotelRequestMutation,
  useGetHotelRequestsQuery,
  useRejectHotelRequestMutation
} from '../store/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle
};

export default function AdminHotelRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { data, isLoading, isError, refetch } = useGetHotelRequestsQuery();
  const [approveHotel, { isLoading: isApproving }] = useApproveHotelRequestMutation();
  const [rejectHotel, { isLoading: isRejecting }] = useRejectHotelRequestMutation();
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const requests = useMemo(() => {
    // backend returns raw Hotel docs for now; adapt to UI shape if needed
    if (!data) return [];
    return Array.isArray(data?.data?.requests) ? data.data.requests : data;
  }, [data]);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return requests;
    return (requests || []).filter((r) => r?.name?.toLowerCase().includes(term));
  }, [requests, searchTerm]);

  const handleApprove = async (requestId) => {
    try {
      setApprovingId(requestId);
      await approveHotel(requestId);
      refetch();
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setRejectingId(requestId);
      await rejectHotel({ requestId });
      refetch();
    } finally {
      setRejectingId(null);
    }
  };

  // Counts are shown inline as a search-result style label

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-end gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Hotel Requests</h1>
          <span className="text-sm text-gray-600 mb-1">{(filteredRequests || []).length} request{(filteredRequests || []).length === 1 ? '' : 's'} found</span>
        </div>
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Removed tiles; count shown inline next to title */}

      {/* Removed status filter. Search moved to header for cleaner layout */}

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-gray-600">Loading requests...</CardContent>
          </Card>
        )}
        {isError && (
          <Card>
            <CardContent className="p-6 text-red-600">Failed to load requests.</CardContent>
          </Card>
        )}
        {!isLoading && !isError && filteredRequests.map((request) => {
          const StatusIcon = statusIcons[request.status];
          return (
            <Card key={request.id || request._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{request.name}</h3>
                      <Badge className={statusColors[request.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{request.owner?.name || request.ownerId?.email || 'Owner'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{request.location || request.locationText || ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(request.submittedAt || request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{request.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(request.amenities || []).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Rooms: {(request.rooms?.length) ?? request.rooms} {request.priceStartingFrom ? `| Price from: $${request.priceStartingFrom}` : ''}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApprove(request.id || request._id)}
                        size="sm"
                        disabled={isApproving && approvingId === (request.id || request._id)}
                        className={isApproving && approvingId === (request.id || request._id) ? 'opacity-75 cursor-not-allowed' : ''}
                      >
                        {isApproving && approvingId === (request.id || request._id) ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleReject(request.id || request._id)}
                        variant="destructive"
                        size="sm"
                        disabled={isRejecting && rejectingId === (request.id || request._id)}
                        className={isRejecting && rejectingId === (request.id || request._id) ? 'opacity-75 cursor-not-allowed' : ''}
                      >
                        {isRejecting && rejectingId === (request.id || request._id) ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!filteredRequests || filteredRequests.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'No matches for your search'
                  : 'No hotel requests have been submitted yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
