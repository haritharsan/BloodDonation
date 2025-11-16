// AdminDashboard.js
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField,
  MenuItem, Button, Stack
} from '@mui/material';
import axios from 'axios';
import 'jspdf-autotable';
import './AdminDashboard.css';

const RequestBloodDashboard = () => {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRes = await axios.get('http://localhost:8080/doner/getAllDonor');
        setDonors(donorRes.data || []);
       
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };
    fetchData();
  }, []);

  const filterData = (data) => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.fullName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q);

      const matchesBlood = bloodGroup ? item.bloodGroup === bloodGroup : true;
            const matchesCity = city ? item.city?.toLowerCase().includes(city.toLowerCase()) : true;

      return matchesSearch && matchesBlood && matchesCity;
    });
  };


  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const CardsGrid = ({ data, type }) => (
    <Box
      sx={{
        mt: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        alignItems: 'stretch',
      }}
    >
      {data.map((item, idx) => (
        <Paper
          key={`${type}-${item.id ?? idx}`}
          elevation={3}
          className="glass-card"
          sx={{ p: 2, width: '100%', height: '100%' }}
        >
          <Typography variant="h6" color="error">
            {idx + 1}. {item.fullName}
          </Typography>
          <Typography>Email: {item.email}</Typography>
          <Typography>Phone: {item.phone}</Typography>
          <Typography>Blood Group: {item.bloodGroup}</Typography>
          <Typography>City: {item.city}</Typography>
          {type === 'donor' && (
            <Typography>Last Donation: {item.lastDonationDate}</Typography>
          )}
          {type === 'request' && (
            <>
              <Typography>Required Date: {item.requiredDate}</Typography>
              <Typography>Reason: {item.reason}</Typography>
            </>
          )}
        </Paper>
      ))}
    </Box>
  );

  const filteredDonors = filterData(donors);
  const filteredRequests = filterData(requests);

  return (
    <Box p={4} className="admin-dashboard-bg">
      <Typography variant="h4" gutterBottom textAlign="center">
     RequestBlood Dashboard
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2} mb={3}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
           InputLabelProps={{ style: { color: 'red' } }}
           sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "red" },
              "&:hover fieldset": { borderColor: "darkred" },
              "&.Mui-focused fieldset": { borderColor: "red" }
            }
          }}
        />
        <TextField
          label="Blood Group"
          select
          fullWidth
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
           InputLabelProps={{ style: { color: 'red' } }}
           sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "red" },
              "&:hover fieldset": { borderColor: "darkred" },
              "&.Mui-focused fieldset": { borderColor: "red" }
            }
          }}
        >
          <MenuItem value="">All</MenuItem>
          {bloodGroups.map((bg) => (
            <MenuItem key={bg} value={bg}>{bg}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
           InputLabelProps={{ style: { color: 'red' } }}
           sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "red" },
              "&:hover fieldset": { borderColor: "darkred" },
              "&.Mui-focused fieldset": { borderColor: "red" }
            }
          }}
        />
      </Stack>

      {/* Donors */}
      <Box mb={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Donors</Typography>
          
        </Stack>
        <CardsGrid data={filteredDonors} type="donor" />
      </Box>
     
    </Box>
  );
};

export default RequestBloodDashboard;
