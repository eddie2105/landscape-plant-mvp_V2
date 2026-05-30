import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { PlantFilters } from '../types/plant';

interface FilterPanelProps {
  filters: PlantFilters;
  options: Record<keyof Omit<PlantFilters, 'chinese_name' | 'scientific_name'>, string[]>;
  onFilterChange: (field: keyof PlantFilters, value: string) => void;
  onReset: () => void;
}

interface SelectFieldProps {
  field: keyof Omit<PlantFilters, 'chinese_name' | 'scientific_name'>;
  label: string;
  value: string;
  options: string[];
  onFilterChange: (field: keyof PlantFilters, value: string) => void;
}

function SelectField({ field, label, value, options, onFilterChange }: SelectFieldProps) {
  const labelId = `${field}-label`;

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(event) => onFilterChange(field, event.target.value)}
      >
        <MenuItem value="">全部</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function FilterPanel({ filters, options, onFilterChange, onReset }: FilterPanelProps) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5">植栽篩選</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            先縮小候選範圍，再從下方卡片挑選植栽。
          </Typography>
        </Box>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={onReset}
          sx={{ flexShrink: 0, minHeight: 40 }}
        >
          重設篩選
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <TextField
          label="中文名稱"
          size="small"
          value={filters.chinese_name}
          onChange={(event) => onFilterChange('chinese_name', event.target.value)}
          fullWidth
        />

        <TextField
          label="學名"
          size="small"
          value={filters.scientific_name}
          onChange={(event) => onFilterChange('scientific_name', event.target.value)}
          fullWidth
        />

        <SelectField
          field="plant_type"
          label="植栽類型"
          value={filters.plant_type}
          options={options.plant_type}
          onFilterChange={onFilterChange}
        />

        <SelectField
          field="light_condition"
          label="光照條件"
          value={filters.light_condition}
          options={options.light_condition}
          onFilterChange={onFilterChange}
        />

        <SelectField
          field="flower_color_group"
          label="花色色系"
          value={filters.flower_color_group}
          options={options.flower_color_group}
          onFilterChange={onFilterChange}
        />

        <SelectField
          field="leaf_color_group"
          label="葉色色系"
          value={filters.leaf_color_group}
          options={options.leaf_color_group}
          onFilterChange={onFilterChange}
        />

        <SelectField
          field="plant_layer"
          label="植栽層次"
          value={filters.plant_layer}
          options={options.plant_layer}
          onFilterChange={onFilterChange}
        />

        <SelectField
          field="flowering_season"
          label="花期季節"
          value={filters.flowering_season}
          options={options.flowering_season}
          onFilterChange={onFilterChange}
        />

      </Box>
    </Card>
  );
}

export default FilterPanel;
