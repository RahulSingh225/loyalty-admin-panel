// app/superadmin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { ExpandMore, Add, Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";

// Types for our data
interface Client {
  id: number;
  name: string;
  code?: string;
}

interface UserTypeLevel {
  id: number;
  levelNo: number;
  levelName: string;
  parentLevelId?: number;
}

interface UserTypeEntity {
  id: number;
  levelId: number;
  typeName: string;
  parentTypeId?: number;
  isActive: boolean;
}

interface SkuLevel {
  id: number;
  clientId: number;
  levelNo: number;
  levelName: string;
  parentLevelId?: number;
}

interface SkuEntity {
  id: number;
  clientId: number;
  levelId: number;
  name: string;
  code?: string;
  parentEntityId?: number;
  isActive: boolean;
}

interface SkuVariant {
  id: number;
  skuEntityId: number;
  variantName: string;
  packSize?: string;
  mrp: number;
  isActive: boolean;
}

interface SkuPointConfig {
  id: number;
  clientId: number;
  skuVariantId: number;
  userTypeId: number;
  pointsPerUnit: string;
}

interface LocationLevel {
  id: number;
  clientId: number;
  levelNo: number;
  levelName: string;
  parentLevelId?: number;
}

interface LocationEntity {
  id: number;
  clientId: number;
  levelId: number;
  name: string;
  code?: string;
  parentEntityId?: number;
}

interface MasterData {
  earningTypes: any[];
  qrTypes: any[];
  redemptionChannels: any[];
  redemptionStatuses: any[];
  schemeTypes: any[];
  creativesTypeList: any[];
}

// Main component
export default function SuperAdminPage() {
  // State for tab navigation
  const [tabValue, setTabValue] = useState(0);

  // State for all data
  const [clients, setClients] = useState<Client[]>([]);
  const [userTypeLevels, setUserTypeLevels] = useState<UserTypeLevel[]>([]);
  const [userTypeEntities, setUserTypeEntities] = useState<UserTypeEntity[]>([]);
  const [skuLevels, setSkuLevels] = useState<SkuLevel[]>([]);
  const [skuEntities, setSkuEntities] = useState<SkuEntity[]>([]);
  const [skuVariants, setSkuVariants] = useState<SkuVariant[]>([]);
  const [skuPointConfigs, setSkuPointConfigs] = useState<SkuPointConfig[]>([]);
  const [locationLevels, setLocationLevels] = useState<LocationLevel[]>([]);
  const [locationEntities, setLocationEntities] = useState<LocationEntity[]>([]);
  const [masterData, setMasterData] = useState<MasterData>({
    earningTypes: [],
    qrTypes: [],
    redemptionChannels: [],
    redemptionStatuses: [],
    schemeTypes: [],
    creativesTypeList: [],
  });

  // State for forms
  const [clientForm, setClientForm] = useState({ name: "", code: "" });
  const [userTypeLevelForm, setUserTypeLevelForm] = useState({
    levelNo: "",
    levelName: "",
    parentLevelId: "",
  });
  const [userTypeEntityForm, setUserTypeEntityForm] = useState({
    levelId: "",
    typeName: "",
    parentTypeId: "",
  });
  const [skuLevelForm, setSkuLevelForm] = useState({
    clientId: "",
    levelNo: "",
    levelName: "",
    parentLevelId: "",
  });
  const [skuEntityForm, setSkuEntityForm] = useState({
    clientId: "",
    levelId: "",
    name: "",
    code: "",
    parentEntityId: "",
  });
  const [skuVariantForm, setSkuVariantForm] = useState({
    skuEntityId: "",
    variantName: "",
    packSize: "",
    mrp: "",
  });
  const [skuPointConfigForm, setSkuPointConfigForm] = useState({
    clientId: "",
    skuVariantId: "",
    userTypeId: "",
    pointsPerUnit: "",
  });
  const [locationLevelForm, setLocationLevelForm] = useState({
    clientId: "",
    levelNo: "",
    levelName: "",
    parentLevelId: "",
  });
  const [locationEntityForm, setLocationEntityForm] = useState({
    clientId: "",
    levelId: "",
    name: "",
    code: "",
    parentEntityId: "",
  });

  // State for dialogs
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [userTypeLevelDialogOpen, setUserTypeLevelDialogOpen] = useState(false);
  const [userTypeEntityDialogOpen, setUserTypeEntityDialogOpen] = useState(false);
  const [skuLevelDialogOpen, setSkuLevelDialogOpen] = useState(false);
  const [skuEntityDialogOpen, setSkuEntityDialogOpen] = useState(false);
  const [skuVariantDialogOpen, setSkuVariantDialogOpen] = useState(false);
  const [skuPointConfigDialogOpen, setSkuPointConfigDialogOpen] = useState(false);
  const [locationLevelDialogOpen, setLocationLevelDialogOpen] = useState(false);
  const [locationEntityDialogOpen, setLocationEntityDialogOpen] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/superadmin");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      
      setClients(data.clients);
      setUserTypeLevels(data.userTypeLevels);
      setUserTypeEntities(data.userTypeEntities);
      setSkuLevels(data.skuLevels);
      setSkuEntities(data.skuEntities);
      setSkuVariants(data.skuVariants);
      setSkuPointConfigs(data.skuPointConfigs);
      setLocationLevels(data.locationLevels);
      setLocationEntities(data.locationEntities);
      setMasterData({
        earningTypes: data.earningTypeList,
        qrTypes: data.qrTypeList,
        redemptionChannels: data.redemptionChannelList,
        redemptionStatuses: data.redemptionStatusList,
        schemeTypes: data.schemeTypeList,
        creativesTypeList: data.creativesTypeList,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  // API functions for creating data
  const createClient = async () => {
    try {
      const response = await fetch("/api/superadmin/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      });
      if (!response.ok) throw new Error("Failed to create client");
      toast.success("Client created successfully");
      setClientDialogOpen(false);
      setClientForm({ name: "", code: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    }
  };

  const createUserTypeLevel = async () => {
    try {
      const response = await fetch("/api/superadmin/user-type-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userTypeLevelForm,
          levelNo: parseInt(userTypeLevelForm.levelNo),
          parentLevelId: userTypeLevelForm.parentLevelId
            ? parseInt(userTypeLevelForm.parentLevelId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create user type level");
      toast.success("User type level created successfully");
      setUserTypeLevelDialogOpen(false);
      setUserTypeLevelForm({ levelNo: "", levelName: "", parentLevelId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating user type level:", error);
      toast.error("Failed to create user type level");
    }
  };

  const createUserTypeEntity = async () => {
    try {
      const response = await fetch("/api/superadmin/user-type-entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userTypeEntityForm,
          levelId: parseInt(userTypeEntityForm.levelId),
          parentTypeId: userTypeEntityForm.parentTypeId
            ? parseInt(userTypeEntityForm.parentTypeId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create user type entity");
      toast.success("User type entity created successfully");
      setUserTypeEntityDialogOpen(false);
      setUserTypeEntityForm({ levelId: "", typeName: "", parentTypeId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating user type entity:", error);
      toast.error("Failed to create user type entity");
    }
  };

  const createSkuLevel = async () => {
    try {
      const response = await fetch("/api/superadmin/sku-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...skuLevelForm,
          clientId: parseInt(skuLevelForm.clientId),
          levelNo: parseInt(skuLevelForm.levelNo),
          parentLevelId: skuLevelForm.parentLevelId
            ? parseInt(skuLevelForm.parentLevelId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create SKU level");
      toast.success("SKU level created successfully");
      setSkuLevelDialogOpen(false);
      setSkuLevelForm({ clientId: "", levelNo: "", levelName: "", parentLevelId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating SKU level:", error);
      toast.error("Failed to create SKU level");
    }
  };

  const createSkuEntity = async () => {
    try {
      const response = await fetch("/api/superadmin/sku-entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...skuEntityForm,
          clientId: parseInt(skuEntityForm.clientId),
          levelId: parseInt(skuEntityForm.levelId),
          parentEntityId: skuEntityForm.parentEntityId
            ? parseInt(skuEntityForm.parentEntityId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create SKU entity");
      toast.success("SKU entity created successfully");
      setSkuEntityDialogOpen(false);
      setSkuEntityForm({ clientId: "", levelId: "", name: "", code: "", parentEntityId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating SKU entity:", error);
      toast.error("Failed to create SKU entity");
    }
  };

  const createSkuVariant = async () => {
    try {
      const response = await fetch("/api/superadmin/sku-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...skuVariantForm,
          skuEntityId: parseInt(skuVariantForm.skuEntityId),
          mrp: parseFloat(skuVariantForm.mrp),
        }),
      });
      if (!response.ok) throw new Error("Failed to create SKU variant");
      toast.success("SKU variant created successfully");
      setSkuVariantDialogOpen(false);
      setSkuVariantForm({ skuEntityId: "", variantName: "", packSize: "", mrp: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating SKU variant:", error);
      toast.error("Failed to create SKU variant");
    }
  };

  const createSkuPointConfig = async () => {
    try {
      const response = await fetch("/api/superadmin/sku-point-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...skuPointConfigForm,
          clientId: parseInt(skuPointConfigForm.clientId),
          skuVariantId: parseInt(skuPointConfigForm.skuVariantId),
          userTypeId: parseInt(skuPointConfigForm.userTypeId),
          pointsPerUnit: parseFloat(skuPointConfigForm.pointsPerUnit).toString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create SKU point config");
      toast.success("SKU point config created successfully");
      setSkuPointConfigDialogOpen(false);
      setSkuPointConfigForm({
        clientId: "",
        skuVariantId: "",
        userTypeId: "",
        pointsPerUnit: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error creating SKU point config:", error);
      toast.error("Failed to create SKU point config");
    }
  };

  const createLocationLevel = async () => {
    try {
      const response = await fetch("/api/superadmin/location-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...locationLevelForm,
          clientId: parseInt(locationLevelForm.clientId),
          levelNo: parseInt(locationLevelForm.levelNo),
          parentLevelId: locationLevelForm.parentLevelId
            ? parseInt(locationLevelForm.parentLevelId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create location level");
      toast.success("Location level created successfully");
      setLocationLevelDialogOpen(false);
      setLocationLevelForm({ clientId: "", levelNo: "", levelName: "", parentLevelId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating location level:", error);
      toast.error("Failed to create location level");
    }
  };

  const createLocationEntity = async () => {
    try {
      const response = await fetch("/api/superadmin/location-entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...locationEntityForm,
          clientId: parseInt(locationEntityForm.clientId),
          levelId: parseInt(locationEntityForm.levelId),
          parentEntityId: locationEntityForm.parentEntityId
            ? parseInt(locationEntityForm.parentEntityId)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create location entity");
      toast.success("Location entity created successfully");
      setLocationEntityDialogOpen(false);
      setLocationEntityForm({ clientId: "", levelId: "", name: "", code: "", parentEntityId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating location entity:", error);
      toast.error("Failed to create location entity");
    }
  };

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" className="py-6">
      <Typography variant="h4" component="h1" className="font-bold mb-6 text-center">
        SuperAdmin Masters
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Client" />
          <Tab label="User Type Level" />
          <Tab label="User Type" />
          <Tab label="SKU Level" />
          <Tab label="SKU Entity" />
          <Tab label="SKU Variant" />
          <Tab label="Point Config" />
          <Tab label="Location" />
        </Tabs>
      </Box>

      {/* Client Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card className="mb-4">
          <CardHeader
            title="Client Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setClientDialogOpen(true)}
              >
                Add Client
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {clients.map((client) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{client.name}</Typography>
                      {client.code && (
                        <Typography variant="body2" color="text.secondary">
                          Code: {client.code}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add Client Dialog */}
        <Dialog open={clientDialogOpen} onClose={() => setClientDialogOpen(false)}>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Client Name"
              fullWidth
              variant="outlined"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Client Code (Optional)"
              fullWidth
              variant="outlined"
              value={clientForm.code}
              onChange={(e) => setClientForm({ ...clientForm, code: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClientDialogOpen(false)}>Cancel</Button>
            <Button onClick={createClient}>Add Client</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* User Type Level Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card className="mb-4">
          <CardHeader
            title="User Type Level Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setUserTypeLevelDialogOpen(true)}
              >
                Add User Type Level
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {userTypeLevels.map((level) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={level.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{level.levelName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Level No: {level.levelNo}
                      </Typography>
                      {level.parentLevelId && (
                        <Typography variant="body2" color="text.secondary">
                          Parent Level ID: {level.parentLevelId}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add User Type Level Dialog */}
        <Dialog open={userTypeLevelDialogOpen} onClose={() => setUserTypeLevelDialogOpen(false)}>
          <DialogTitle>Add New User Type Level</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Level No"
              type="number"
              fullWidth
              variant="outlined"
              value={userTypeLevelForm.levelNo}
              onChange={(e) =>
                setUserTypeLevelForm({ ...userTypeLevelForm, levelNo: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Level Name"
              fullWidth
              variant="outlined"
              value={userTypeLevelForm.levelName}
              onChange={(e) =>
                setUserTypeLevelForm({ ...userTypeLevelForm, levelName: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Level (Optional)</InputLabel>
              <Select
                value={userTypeLevelForm.parentLevelId}
                onChange={(e) =>
                  setUserTypeLevelForm({ ...userTypeLevelForm, parentLevelId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {userTypeLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserTypeLevelDialogOpen(false)}>Cancel</Button>
            <Button onClick={createUserTypeLevel}>Add Level</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* User Type Entity Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card className="mb-4">
          <CardHeader
            title="User Type Entity Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setUserTypeEntityDialogOpen(true)}
              >
                Add User Type Entity
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {userTypeEntities.map((entity) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={entity.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{entity.typeName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Level ID: {entity.levelId}
                      </Typography>
                      {entity.parentTypeId && (
                        <Typography variant="body2" color="text.secondary">
                          Parent Type ID: {entity.parentTypeId}
                        </Typography>
                      )}
                      <Chip
                        label={entity.isActive ? "Active" : "Inactive"}
                        color={entity.isActive ? "success" : "error"}
                        size="small"
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add User Type Entity Dialog */}
        <Dialog open={userTypeEntityDialogOpen} onClose={() => setUserTypeEntityDialogOpen(false)}>
          <DialogTitle>Add New User Type Entity</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Level</InputLabel>
              <Select
                value={userTypeEntityForm.levelId}
                onChange={(e) =>
                  setUserTypeEntityForm({ ...userTypeEntityForm, levelId: e.target.value })
                }
              >
                {userTypeLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Type Name"
              fullWidth
              variant="outlined"
              value={userTypeEntityForm.typeName}
              onChange={(e) =>
                setUserTypeEntityForm({ ...userTypeEntityForm, typeName: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Type (Optional)</InputLabel>
              <Select
                value={userTypeEntityForm.parentTypeId}
                onChange={(e) =>
                  setUserTypeEntityForm({ ...userTypeEntityForm, parentTypeId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {userTypeEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserTypeEntityDialogOpen(false)}>Cancel</Button>
            <Button onClick={createUserTypeEntity}>Add Type</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* SKU Level Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card className="mb-4">
          <CardHeader
            title="SKU Level Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSkuLevelDialogOpen(true)}
              >
                Add SKU Level
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {skuLevels.map((level) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={level.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{level.levelName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Client ID: {level.clientId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Level No: {level.levelNo}
                      </Typography>
                      {level.parentLevelId && (
                        <Typography variant="body2" color="text.secondary">
                          Parent Level ID: {level.parentLevelId}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add SKU Level Dialog */}
        <Dialog open={skuLevelDialogOpen} onClose={() => setSkuLevelDialogOpen(false)}>
          <DialogTitle>Add New SKU Level</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                value={skuLevelForm.clientId}
                onChange={(e) => setSkuLevelForm({ ...skuLevelForm, clientId: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Level No"
              type="number"
              fullWidth
              variant="outlined"
              value={skuLevelForm.levelNo}
              onChange={(e) => setSkuLevelForm({ ...skuLevelForm, levelNo: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Level Name"
              fullWidth
              variant="outlined"
              value={skuLevelForm.levelName}
              onChange={(e) => setSkuLevelForm({ ...skuLevelForm, levelName: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Level (Optional)</InputLabel>
              <Select
                value={skuLevelForm.parentLevelId}
                onChange={(e) => setSkuLevelForm({ ...skuLevelForm, parentLevelId: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {skuLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkuLevelDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSkuLevel}>Add Level</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* SKU Entity Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card className="mb-4">
          <CardHeader
            title="SKU Entity Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSkuEntityDialogOpen(true)}
              >
                Add SKU Entity
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {skuEntities.map((entity) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={entity.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{entity.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Client ID: {entity.clientId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Level ID: {entity.levelId}
                      </Typography>
                      {entity.code && (
                        <Typography variant="body2" color="text.secondary">
                          Code: {entity.code}
                        </Typography>
                      )}
                      {entity.parentEntityId && (
                        <Typography variant="body2" color="text.secondary">
                          Parent Entity ID: {entity.parentEntityId}
                        </Typography>
                      )}
                      <Chip
                        label={entity.isActive ? "Active" : "Inactive"}
                        color={entity.isActive ? "success" : "error"}
                        size="small"
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add SKU Entity Dialog */}
        <Dialog open={skuEntityDialogOpen} onClose={() => setSkuEntityDialogOpen(false)}>
          <DialogTitle>Add New SKU Entity</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                value={skuEntityForm.clientId}
                onChange={(e) => setSkuEntityForm({ ...skuEntityForm, clientId: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Level</InputLabel>
              <Select
                value={skuEntityForm.levelId}
                onChange={(e) => setSkuEntityForm({ ...skuEntityForm, levelId: e.target.value })}
              >
                {skuLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={skuEntityForm.name}
              onChange={(e) => setSkuEntityForm({ ...skuEntityForm, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Code (Optional)"
              fullWidth
              variant="outlined"
              value={skuEntityForm.code}
              onChange={(e) => setSkuEntityForm({ ...skuEntityForm, code: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Entity (Optional)</InputLabel>
              <Select
                value={skuEntityForm.parentEntityId}
                onChange={(e) =>
                  setSkuEntityForm({ ...skuEntityForm, parentEntityId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {skuEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkuEntityDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSkuEntity}>Add Entity</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* SKU Variant Tab */}
      <TabPanel value={tabValue} index={5}>
        <Card className="mb-4">
          <CardHeader
            title="SKU Variant Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSkuVariantDialogOpen(true)}
              >
                Add SKU Variant
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {skuVariants.map((variant) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={variant.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">{variant.variantName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU Entity ID: {variant.skuEntityId}
                      </Typography>
                      {variant.packSize && (
                        <Typography variant="body2" color="text.secondary">
                          Pack Size: {variant.packSize}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        MRP: {variant.mrp}
                      </Typography>
                      <Chip
                        label={variant.isActive ? "Active" : "Inactive"}
                        color={variant.isActive ? "success" : "error"}
                        size="small"
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add SKU Variant Dialog */}
        <Dialog open={skuVariantDialogOpen} onClose={() => setSkuVariantDialogOpen(false)}>
          <DialogTitle>Add New SKU Variant</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>SKU Entity</InputLabel>
              <Select
                value={skuVariantForm.skuEntityId}
                onChange={(e) =>
                  setSkuVariantForm({ ...skuVariantForm, skuEntityId: e.target.value })
                }
              >
                {skuEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Variant Name"
              fullWidth
              variant="outlined"
              value={skuVariantForm.variantName}
              onChange={(e) =>
                setSkuVariantForm({ ...skuVariantForm, variantName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Pack Size (Optional)"
              fullWidth
              variant="outlined"
              value={skuVariantForm.packSize}
              onChange={(e) =>
                setSkuVariantForm({ ...skuVariantForm, packSize: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="MRP"
              type="number"
              fullWidth
              variant="outlined"
              value={skuVariantForm.mrp}
              onChange={(e) => setSkuVariantForm({ ...skuVariantForm, mrp: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkuVariantDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSkuVariant}>Add Variant</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* SKU Point Config Tab */}
      <TabPanel value={tabValue} index={6}>
        <Card className="mb-4">
          <CardHeader
            title="SKU Point Configuration Management"
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSkuPointConfigDialogOpen(true)}
              >
                Add Point Configuration
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {skuPointConfigs.map((config) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={config.id}>
                  <Card variant="outlined" className="h-full">
                    <CardContent>
                      <Typography variant="h6">Points: {config.pointsPerUnit}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Client ID: {config.clientId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU Variant ID: {config.skuVariantId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        User Type ID: {config.userTypeId}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add SKU Point Config Dialog */}
        <Dialog open={skuPointConfigDialogOpen} onClose={() => setSkuPointConfigDialogOpen(false)}>
          <DialogTitle>Add New Point Configuration</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                value={skuPointConfigForm.clientId}
                onChange={(e) =>
                  setSkuPointConfigForm({ ...skuPointConfigForm, clientId: e.target.value })
                }
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>SKU Variant</InputLabel>
              <Select
                value={skuPointConfigForm.skuVariantId}
                onChange={(e) =>
                  setSkuPointConfigForm({ ...skuPointConfigForm, skuVariantId: e.target.value })
                }
              >
                {skuVariants.map((variant) => (
                  <MenuItem key={variant.id} value={variant.id}>
                    {variant.variantName} {variant.packSize && `(${variant.packSize})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>User Type</InputLabel>
              <Select
                value={skuPointConfigForm.userTypeId}
                onChange={(e) =>
                  setSkuPointConfigForm({ ...skuPointConfigForm, userTypeId: e.target.value })
                }
              >
                {userTypeEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Points per Unit"
              type="number"
              fullWidth
              variant="outlined"
              value={skuPointConfigForm.pointsPerUnit}
              onChange={(e) =>
                setSkuPointConfigForm({ ...skuPointConfigForm, pointsPerUnit: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkuPointConfigDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSkuPointConfig}>Add Configuration</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Location Tab */}
      <TabPanel value={tabValue} index={7}>
        <div className="space-y-4">
          {/* Location Level */}
          <Card>
            <CardHeader
              title="Location Level Management"
              action={
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setLocationLevelDialogOpen(true)}
                >
                  Add Location Level
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {locationLevels.map((level) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={level.id}>
                    <Card variant="outlined" className="h-full">
                      <CardContent>
                        <Typography variant="h6">{level.levelName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Client ID: {level.clientId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level No: {level.levelNo}
                        </Typography>
                        {level.parentLevelId && (
                          <Typography variant="body2" color="text.secondary">
                            Parent Level ID: {level.parentLevelId}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Location Entity */}
          <Card>
            <CardHeader
              title="Location Entity Management"
              action={
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setLocationEntityDialogOpen(true)}
                >
                  Add Location Entity
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {locationEntities.map((entity) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={entity.id}>
                    <Card variant="outlined" className="h-full">
                      <CardContent>
                        <Typography variant="h6">{entity.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Client ID: {entity.clientId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level ID: {entity.levelId}
                        </Typography>
                        {entity.code && (
                          <Typography variant="body2" color="text.secondary">
                            Code: {entity.code}
                          </Typography>
                        )}
                        {entity.parentEntityId && (
                          <Typography variant="body2" color="text.secondary">
                            Parent Entity ID: {entity.parentEntityId}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </div>

        {/* Add Location Level Dialog */}
        <Dialog open={locationLevelDialogOpen} onClose={() => setLocationLevelDialogOpen(false)}>
          <DialogTitle>Add New Location Level</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                value={locationLevelForm.clientId}
                onChange={(e) =>
                  setLocationLevelForm({ ...locationLevelForm, clientId: e.target.value })
                }
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Level No"
              type="number"
              fullWidth
              variant="outlined"
              value={locationLevelForm.levelNo}
              onChange={(e) =>
                setLocationLevelForm({ ...locationLevelForm, levelNo: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Level Name"
              fullWidth
              variant="outlined"
              value={locationLevelForm.levelName}
              onChange={(e) =>
                setLocationLevelForm({ ...locationLevelForm, levelName: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Level (Optional)</InputLabel>
              <Select
                value={locationLevelForm.parentLevelId}
                onChange={(e) =>
                  setLocationLevelForm({ ...locationLevelForm, parentLevelId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {locationLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLocationLevelDialogOpen(false)}>Cancel</Button>
            <Button onClick={createLocationLevel}>Add Level</Button>
          </DialogActions>
        </Dialog>

        {/* Add Location Entity Dialog */}
        <Dialog open={locationEntityDialogOpen} onClose={() => setLocationEntityDialogOpen(false)}>
          <DialogTitle>Add New Location Entity</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                value={locationEntityForm.clientId}
                onChange={(e) =>
                  setLocationEntityForm({ ...locationEntityForm, clientId: e.target.value })
                }
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Level</InputLabel>
              <Select
                value={locationEntityForm.levelId}
                onChange={(e) =>
                  setLocationEntityForm({ ...locationEntityForm, levelId: e.target.value })
                }
              >
                {locationLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={locationEntityForm.name}
              onChange={(e) =>
                setLocationEntityForm({ ...locationEntityForm, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Code (Optional)"
              fullWidth
              variant="outlined"
              value={locationEntityForm.code}
              onChange={(e) =>
                setLocationEntityForm({ ...locationEntityForm, code: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Entity (Optional)</InputLabel>
              <Select
                value={locationEntityForm.parentEntityId}
                onChange={(e) =>
                  setLocationEntityForm({ ...locationEntityForm, parentEntityId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {locationEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLocationEntityDialogOpen(false)}>Cancel</Button>
            <Button onClick={createLocationEntity}>Add Entity</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Container>
  );
}

// Helper component for tab panels
function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}