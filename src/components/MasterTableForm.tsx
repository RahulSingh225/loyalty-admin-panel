// /components/MasterTableForm.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getTableColumns } from '@/config/masterConfig';
import { sql } from 'drizzle-orm';

// Helper to infer column type from Drizzle schema
const getFieldType = (column: any) => {
  const columnType = column.columnType;
  if (columnType === 'serial' || columnType === 'integer') return 'number';
  if (columnType === 'boolean') return 'boolean';
  if (columnType === 'timestamp' || columnType === 'text' || columnType === 'varchar') return 'text';
  if (columnType === 'numeric') return 'text'; // Render as text, parse as number on save
  if (columnType === 'jsonb') return 'json';
  return 'text';
};

// Helper to find foreign key relationships
const getForeignKey = (column: any, tableSchema: any) => {
  const tableConfig = (tableSchema as any)._;
  const fks = tableConfig.foreignKeys;
  if (!fks) return null;

  const fk = fks.find((fk: any) => fk.columns.includes(column.name));
  if (!fk) return null;

  const refTable = fk.referenceTable;
  const refColumn = fk.referenceColumns[0];
  return { refTable, refColumn };
};

interface MasterTableFormProps {
  title: string;
  tableSchema: any;
  data: any[];
  onChange: (newData: any[]) => void;
  masterData: Record<string, any[]>; // Data for populating foreign key dropdowns
}

export function MasterTableForm({ title, tableSchema, data, onChange, masterData }: MasterTableFormProps) {
  const columns = getTableColumns(tableSchema);

  // Filter out columns that are auto-managed (like primary keys, timestamps)
  const editableColumns = columns.filter(col =>
    !col.primary &&
    col.name !== 'createdAt' &&
    col.name !== 'updatedAt' &&
    col.default !== sql`CURRENT_TIMESTAMP`
  );

  const handleRowChange = (rowIndex: number, fieldName: string, value: any) => {
    const newData = data.map((row, index) =>
      index === rowIndex ? { ...row, [fieldName]: value } : row
    );
    onChange(newData);
  };

  const addRow = () => {
    const newRow: any = {};
    editableColumns.forEach(col => {
      newRow[col.name] = col.default !== undefined ? (typeof col.default === 'function' ? col.default() : col.default) : (col.columnType === 'boolean' ? false : '');
    });
    onChange([...data, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    onChange(data.filter((_, index) => index !== rowIndex));
  };

  return (
    <AccordionDetails>
      <Box width="100%">
        <Typography variant="h6" gutterBottom>
          Configure {title}
        </Typography>
        {data.map((row, rowIndex) => (
          <Box key={rowIndex} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
            <Grid container spacing={2} alignItems="center">
              {editableColumns.map((column) => {
                const fieldType = getFieldType(column);
                const fk = getForeignKey(column, tableSchema);
                const isRequired = column.notNull;

                if (fk) {
                  // Render a Select dropdown for foreign keys
                  const options = masterData[fk.refTable] || [];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={column.name}>
                      <FormControl fullWidth required={isRequired} size="small">
                        <InputLabel>{column.name}</InputLabel>
                        <Select
                          value={row[column.name] || ''}
                          label={column.name}
                          onChange={(e) => handleRowChange(rowIndex, column.name, e.target.value)}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {options.map((option: any) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name || option.code || option.id} {/* Display a human-readable name */}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                }

                // Render other field types
                return (
                  <Grid item xs={12} sm={6} md={4} key={column.name}>
                    {fieldType === 'boolean' ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!row[column.name]}
                            onChange={(e) => handleRowChange(rowIndex, column.name, e.target.checked)}
                          />
                        }
                        label={column.name}
                      />
                    ) : (
                      <TextField
                        label={column.name}
                        type={fieldType === 'number' ? 'number' : 'text'}
                        value={row[column.name] || ''}
                        onChange={(e) => handleRowChange(rowIndex, column.name, fieldType === 'number' ? Number(e.target.value) : e.target.value)}
                        fullWidth
                        required={isRequired}
                        size="small"
                        multiline={fieldType === 'json' || fieldType === 'text'}
                        rows={fieldType === 'json' ? 3 : 1}
                      />
                    )}
                  </Grid>
                );
              })}
              <Grid item>
                <IconButton onClick={() => deleteRow(rowIndex)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button onClick={addRow} startIcon={<AddIcon />} variant="outlined">
          Add {title.slice(0, -1)} {/* Singular form, e.g., 'Add Client' */}
        </Button>
      </Box>
    </AccordionDetails>
  );
}