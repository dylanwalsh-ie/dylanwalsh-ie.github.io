/**
 * @file Renders the "Data Playground" project
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description A client-side BI tool that loads remote CSV files, allows users to query them
 * with SQL using the alasql library, and visualises the results in tables and charts
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import alasql from 'alasql';
import { Chart } from 'chart.js/auto';
import { XIcon, PlayIcon, LinkIcon, FilterIcon, SortAscendingIcon, PlusCircleIcon } from '../icons/ProjectIcons';

declare const alasql: any;

interface DataSource {
  id: number;
  name: string;
  url: string;
  status: 'loading' | 'loaded' | 'error';
}

interface TableSchema {
    name: string;
    columns: { name: string }[];
}

interface Filter {
    id: number;
    column: string;
    operator: string;
    value: string;
}

interface Sort {
    column: string;
    direction: 'ASC' | 'DESC';
}

// Default query to be displayed for the user
// This query is based off the sample CSV file used in the project
// Will auto change on-load to a more simple query for the user to run
const defaultQuery = `SELECT
  Housing,
  COUNT(*) AS NumberOfPeople,
  AVG([Credit amount]) AS AverageCreditAmount
FROM
  creditRisk
GROUP BY
  Housing
ORDER BY
  NumberOfPeople DESC;`;

const defaultDataSources: DataSource[] = [
  { id: 1, name: 'creditRisk', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVOPAPix_QzU3guu0yCnyfa_5XW_jLq7Qh9_SwgPxOIgLY4VrNlAo4XiAYk_0jkSKcx7ZJUBF-ce4E/pub?output=csv', status: 'loading' },
];

const ROWS_PER_PAGE = 100;
const CHART_ROW_LIMIT = 500;

const DataPlayground: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // State management
  const [dataSources, setDataSources] = useState<DataSource[]>(defaultDataSources);
  const [query, setQuery] = useState<string>(defaultQuery);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [view, setView] = useState<'table' | 'chart'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  
  // References for managing the chart.js instance
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  // State for Visual Query Builder
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{[key: string]: string[]}>({});
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sort, setSort] = useState<Sort>({ column: '', direction: 'ASC' });
  const [limit, setLimit] = useState<string>('');
  const [builderFeedback, setBuilderFeedback] = useState('');

  // State for Dynamic Chart
  const [chartConfig, setChartConfig] = useState({
    type: 'bar' as 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea',
    xAxisColumn: '',
    yAxisColumn: '',
  });

  // Executes single query using alassql and updates the results state
  // Wrapped in useCallBack for performance optimisation
  const handleRunQuery = useCallback((queryToExecute: string = query) => {
    setError(null);
    setResults([]);
    setCurrentPage(1);
    if (!queryToExecute) {
      setError("Query cannot be empty.");
      return;
    }
    try {
      const res = alasql(queryToExecute);
      // Result of query may not always be an array, check for this
      if (Array.isArray(res)) {
        setResults(res);
        setStatus(`Query executed successfully. ${res.length} rows returned.`);
        
        if (res.length > 0 && res[0]) {
            const columns = Object.keys(res[0]);
            setChartConfig(prev => ({
                ...prev,
                xAxisColumn: columns[0] || '',
                yAxisColumn: columns.length > 1 ? columns[1] : columns[0] || ''
            }));
        } else {
            // Reset chart config for empty results
            setChartConfig({ type: 'bar', xAxisColumn: '', yAxisColumn: '' });
        }
      } else {
        setResults([]); // Ensure results is always an array
        setChartConfig({ type: 'bar', xAxisColumn: '', yAxisColumn: '' });
        setStatus(`Query executed successfully. No tabular data returned.`);
      }
    } catch (e: any) {
      setError(e.message);
      setStatus('Query execution failed.');
    }
  }, [query]);

  // Loads data from cloud-hosted CSV file into the alasql database
  const loadDataSources = useCallback(async (sourcesToLoad: DataSource[]): Promise<boolean> => {
    if (sourcesToLoad.length === 0) return true;
    setStatus('Loading data sources...');
    let allLoadedSuccessfully = true;

    // Holds schema definitions of newly loaded tables
    const newSchemaAdditions: TableSchema[] = [];
  
    for (const source of sourcesToLoad) {
      try {
        // Fetches and parses the CSV file from the given URL
        // Set headers to true to use the first row of the CSV as column names
        const data = await alasql.promise(`SELECT * FROM CSV(?, {headers:true})`, [source.url]);
        alasql(`DROP TABLE IF EXISTS \`${source.name}\``);
        alasql(`CREATE TABLE \`${source.name}\``);

        // Populate new table with fetched data
        // '?' prevents SQL injection vulnerabilities, acting as a placeholder for the 'data' array
        alasql(`SELECT * INTO \`${source.name}\` FROM ?`, [data]);
        
        setDataSources(prev => prev.map(ds => ds.id === source.id ? { ...ds, status: 'loaded' } : ds));
        
        if (data && data.length > 0) {
            const columns = Object.keys(data[0]).map(colName => ({ name: colName.trim() }));
            newSchemaAdditions.push({ name: source.name, columns });
        }
      } catch (e) {
        console.error(`Failed to load ${source.name}:`, e);
        allLoadedSuccessfully = false;
        setDataSources(prev => prev.map(ds => ds.id === source.id ? { ...ds, status: 'error' } : ds));
        setStatus(`Error loading data from ${source.url}. Check URL and CORS policy.`);
      }
    }

    if (newSchemaAdditions.length > 0) {
      // Ensure existing schemas get replaced for tables that are reloaded
      setSchema(prev => [...prev.filter(s => !newSchemaAdditions.some(n => n.name === s.name)), ...newSchemaAdditions]);
    }
  
    if (allLoadedSuccessfully) {
      setStatus('Data sources loaded successfully.');
    }
    return allLoadedSuccessfully;
  }, []);

  const previewTable = useCallback((tableName: string) => {
    const previewQuery = `SELECT * FROM \`${tableName}\` LIMIT 100;`;
    setQuery(previewQuery);
    handleRunQuery(previewQuery);
    setStatus(`Displaying a preview of '${tableName}'.`);
  }, [handleRunQuery]);

  useEffect(() => {
    const performInitialLoad = async () => {
        const sourcesToLoad = dataSources.filter(ds => ds.status === 'loading');
        if (sourcesToLoad.length > 0) {
            const success = await loadDataSources(sourcesToLoad);
            if (success && sourcesToLoad.length > 0) {
                setQuery(defaultQuery);
                previewTable(sourcesToLoad[0].name);
                setStatus(`Default 'creditRisk' data loaded. Previewing table. Run the example query or build your own!`);
            }
        }
    };
    performInitialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  // Hook that automatically builds SQL query strings
  // when the user interacts with the query builder interface
  useEffect(() => {
    const isBuilderActive =
      Object.values(selectedColumns).some(cols => cols.length > 0) ||
      filters.length > 0 ||
      !!sort.column ||
      !!limit;
  
    if (!isBuilderActive) {
      return;
    }
  
    const tablesInvolved = new Set<string>();
    Object.keys(selectedColumns).forEach(table => {
      if (selectedColumns[table].length > 0) tablesInvolved.add(table);
    });
    filters.forEach(f => {
      if (f.column) tablesInvolved.add(f.column.split('.')[0]);
    });
    if (sort.column) tablesInvolved.add(sort.column.split('.')[0]);
  
    if (tablesInvolved.size === 0) {
      setQuery('// Select columns from the schema to start building a query.');
      return;
    }
  
    // Takes the first table identified as the primary table for the query
    const primaryTable = Array.from(tablesInvolved)[0];
    const selectedColsForPrimary = selectedColumns[primaryTable] || [];
  
    // If columns are selected, list them, other use *
    // Use backticks to handle coolumn names that might be SQL keywords
    const selectClause = selectedColsForPrimary.length > 0
      ? selectedColsForPrimary.map(c => `\`${c}\``).join(',\n  ')
      : '*';
  
    // Begin building the final SQL string
    let sql = `SELECT\n  ${selectClause}\nFROM\n  \`${primaryTable}\``;
  
    const whereClauses = filters
    // Only use valid, complete filters belonging to the primary table
      .filter(f => f.column && f.operator && f.value && f.column.startsWith(primaryTable))
      .map(f => {
        const column = f.column.split('.')[1];
        // Check if value is number or string, string needs to be wrapped in single quotes
        // Escape single quotes within the string itself to prevent errors
        const value = isNaN(Number(f.value)) ? `'${f.value.replace(/'/g, "''")}'` : f.value;
        return `\`${column}\` ${f.operator} ${value}`;
      }).join(' AND\n  ');
  
    // Append WHERE clauses to string if present
    if (whereClauses) {
      sql += `\nWHERE\n  ${whereClauses}`;
    }
  
    // If a sort column is defined to a primary table, add an ORDER BY clause
    if (sort.column && sort.column.startsWith(primaryTable)) {
      const column = sort.column.split('.')[1];
      sql += `\nORDER BY\n  \`${column}\` ${sort.direction}`;
    }
  
    // If a valid row limit is set add a LIMIT clause
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      sql += `\nLIMIT ${limitNum}`;
    }
  
    // Update the query editor text with the final query
    setQuery(sql + ';');
  
    setBuilderFeedback('// QUERY UPDATED //');
    const timer = setTimeout(() => setBuilderFeedback(''), 1500);
    return () => clearTimeout(timer);
  
  }, [selectedColumns, filters, sort, limit, schema]);


  const handleAddDataSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) {
        setError("Table name and URL are required.");
        return;
    }
    const newSource: DataSource = {
      id: Date.now(),
      name: newSourceName.trim().replace(/[^a-zA-Z0-9_]/g, '_'),
      url: newSourceUrl.trim(),
      status: 'loading'
    };
    setDataSources(prev => [...prev, newSource]);
    const success = await loadDataSources([newSource]);
    if (success) {
        previewTable(newSource.name);
    }
    setNewSourceName('');
    setNewSourceUrl('');
  };

  const removeDataSource = (id: number) => {
    const sourceToRemove = dataSources.find(ds => ds.id === id);
    if (sourceToRemove) {
        alasql(`DROP TABLE IF EXISTS \`${sourceToRemove.name}\``);
        setDataSources(prev => prev.filter(ds => ds.id !== id));
        setSchema(prev => prev.filter(s => s.name !== sourceToRemove.name));
        setStatus(`Data source '${sourceToRemove.name}' removed.`);
    }
  };

  const handleColumnSelect = (table: string, column: string, checked: boolean) => {
    setSelectedColumns(prev => {
        const tableCols = prev[table] || [];
        const newTableCols = checked
            ? [...tableCols, column]
            : tableCols.filter(c => c !== column);
        return { ...prev, [table]: newTableCols };
    });
  };

  const handleAddFilter = () => {
      setFilters(prev => [...prev, {id: Date.now(), column: '', operator: '=', value: ''}]);
  };

  const handleFilterChange = (id: number, field: keyof Omit<Filter, 'id'>, value: string) => {
      setFilters(prev => prev.map(f => f.id === id ? {...f, [field]: value} : f));
  };
  
  const handleRemoveFilter = (id: number) => {
      setFilters(prev => prev.filter(f => f.id !== id));
  };

  const allColumnsInSchema = schema.flatMap(s => s.columns.map(c => `${s.name}.${c.name}`));

  // Renders or re-renders the chart based on query results and configurations
  const renderChart = useCallback(() => {
    // If a chart instance already exists, destroy it to avoid memory leaks
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    // If necessary elements like canvas, data and config are missing, exit
    if (!chartRef.current || results.length === 0 || !chartConfig.xAxisColumn || !chartConfig.yAxisColumn) {
      return;
    }

    // Retrieve 2D drawing context from the canvas element
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Only render a subset of the results for performance
    const dataToRender = results.slice(0, CHART_ROW_LIMIT);
    const labels = dataToRender.map(row => row[chartConfig.xAxisColumn]);
    const data = dataToRender.map(row => row[chartConfig.yAxisColumn]);

    // Dynamic styling
    const chartType = chartConfig.type;
    const isRadial = ['radar', 'polarArea'].includes(chartType);
    const isCategorical = ['pie', 'doughnut'].includes(chartType);

    // Cyberpunk theme palette colours for the chart
    const cyberColors = [
      'rgba(96, 165, 250, 0.6)', 'rgba(234, 51, 247, 0.6)',
      'rgba(255, 240, 0, 0.6)', 'rgba(132, 94, 247, 0.6)', 'rgba(255, 107, 0, 0.6)'
    ];

    let backgroundColor: string | string[];
    let borderColor: string | string[];

    // Cycle through colour palette for charts that need
    // different colours for each segment, such as a pie chart
    if (isCategorical || isRadial) {
      const bgColors = data.map((_, i) => cyberColors[i % cyberColors.length]);
      backgroundColor = bgColors;
      borderColor = bgColors.map(c => c.replace('0.6', '1'));
    } else {
      // Use a single colour for other charts such as bar or line
      backgroundColor = 'rgba(96, 165, 250, 0.5)';
      borderColor = 'rgba(96, 165, 250, 1)';
    }
    
    // Define options for chart configuration
    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: isCategorical || isRadial, labels: { color: '#c9d1d9' } },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(13, 17, 23, 0.9)',
            titleFont: { family: "'Share Tech Mono', monospace" },
            bodyFont: { family: "'Inter', sans-serif" },
            titleColor: '#60a5fa',
            bodyColor: '#c9d1d9',
            borderColor: 'rgba(96, 165, 250, 0.5)',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            boxPadding: 4,
          }
        }
    };
    
    // Add specific scale options for different chart types
    if (isRadial) {
        chartOptions.scales = {
            r: {
                angleLines: { color: 'rgba(201, 209, 217, 0.2)' },
                grid: { color: 'rgba(201, 209, 217, 0.2)' },
                pointLabels: { color: '#c9d1d9', font: { family: "'Share Tech Mono', monospace", size: 10 } },
                ticks: { color: '#c9d1d9', backdropColor: 'rgba(0,0,0,0.5)' }
            }
        };
    } else if (!isCategorical) {
        chartOptions.scales = {
          y: { beginAtZero: true, ticks: { color: '#c9d1d9' }, grid: { color: 'rgba(59, 130, 246, 0.1)' } },
          x: { ticks: { color: '#c9d1d9' }, grid: { color: 'rgba(59, 130, 246, 0.1)' } }
        };
    }

    // Create new chart instance and store it within reference for future access
    chartInstanceRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: chartConfig.yAxisColumn,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1.5,
          pointBackgroundColor: 'rgba(96, 165, 250, 1)',
          pointBorderColor: '#fff'
        }]
      },
      options: chartOptions,
    });
  }, [results, chartConfig]);


  // Hook that triggers the chart rendering logic at the appropriate time
  useEffect(() => {
    if (view === 'chart') {
      renderChart();
    }
  }, [view, renderChart]);
  
  const totalPages = Math.ceil(results.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

  const getStatusBorderColor = (status: 'loading' | 'loaded' | 'error') => {
    switch (status) {
        case 'loaded': return 'border-green-400';
        case 'error': return 'border-red-400';
        case 'loading': return 'border-yellow-400 animate-pulse';
        default: return 'border-gray-600';
    }
  }

  const title = "// DATA_HUB :: CLIENT-SIDE ANALYSIS CORE";

  return (
    <div className="h-full w-full flex flex-col text-white bg-[#0d1117] font-sans">
      <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b border-blue-900/50 p-2 flex items-center justify-between z-10 flex-shrink-0">
        <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
        <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
      </header>
      
      <div className="flex flex-row flex-grow overflow-hidden">
        <aside className="w-2/5 xl:w-1/3 flex-shrink-0 bg-black/30 border-r-2 border-blue-500/30 p-4 overflow-y-auto flex flex-col gap-6 cyber-scrollbar">
            
            <div className="cyber-card p-3 relative scanline-overlay">
                <div className="border-b border-blue-900/50 -mx-3 px-3 py-1 mb-4">
                  <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// DATA_SOURCES</h3>
                </div>
                {dataSources.map(ds => (
                    <div key={ds.id} className={`flex items-center justify-between p-2 mb-2 bg-black/30 border-l-4 rounded-r-md ${getStatusBorderColor(ds.status)}`}>
                        <button onClick={() => previewTable(ds.name)} className="truncate pr-2 hover:text-blue-300 transition-colors text-left">
                            <p className="font-semibold text-sm">{ds.name}</p>
                            <p className="text-xs text-gray-500 truncate">{ds.url}</p>
                        </button>
                        <button onClick={() => removeDataSource(ds.id)} className="text-gray-500 hover:text-red-400 p-1 flex-shrink-0">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <form onSubmit={handleAddDataSource} className="mt-4 pt-4 border-t border-blue-900/50 space-y-2">
                    <input type="text" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="Table Name" className="cyber-input w-full"/>
                    <div className="flex gap-2">
                        <input type="url" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="CSV URL" className="cyber-input flex-grow"/>
                        <button type="submit" className="cyber-button cyber-button-primary px-3 text-sm"><LinkIcon className="w-5 h-5"/></button>
                    </div>
                </form>
            </div>

             <div className="cyber-card p-3 relative scanline-overlay flex-grow flex flex-col">
                <div className="border-b border-blue-900/50 -mx-3 px-3 py-1 mb-4">
                  <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// VISUAL_QUERY_BUILDER</h3>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 -mr-2 cyber-scrollbar">
                    {schema.length === 0 && <p className="text-xs text-gray-500 text-center font-mono py-4">// LOAD_A_DATASOURCE_TO_SEE_SCHEMA //</p>}
                    
                    {schema.map(table => (
                        <div key={table.name} className="mb-4">
                            <h4 className="font-mono text-sm text-blue-400 tracking-wider mb-2">// TABLE: {table.name}</h4>
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-2 cyber-scrollbar">
                                {table.columns.map(col => (
                                    <label key={`${table.name}-${col.name}`} className="cyber-checkbox text-sm">
                                        <input type="checkbox" checked={(selectedColumns[table.name] || []).includes(col.name)} onChange={e => handleColumnSelect(table.name, col.name, e.target.checked)} />
                                        <span className="checkmark"></span>
                                        <span>{col.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 pt-4 border-t border-blue-900/50">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-mono text-sm text-blue-400 tracking-wider">// FILTERS</h4>
                            <button onClick={handleAddFilter} className="text-blue-400 hover:text-blue-300"><PlusCircleIcon className="w-5 h-5"/></button>
                        </div>
                         {filters.map(filter => (
                            <div key={filter.id} className="flex gap-1 mb-2 items-center">
                                <select value={filter.column} onChange={e => handleFilterChange(filter.id, 'column', e.target.value)} className="cyber-select text-xs flex-grow w-1/3">
                                    <option value="">-- select column --</option>
                                    {allColumnsInSchema.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={filter.operator} onChange={e => handleFilterChange(filter.id, 'operator', e.target.value)} className="cyber-select text-xs w-auto">
                                    <option>=</option><option>&lt;&gt;</option><option>&gt;</option><option>&lt;</option><option>&gt;=</option><option>&lt;=</option><option>LIKE</option>
                                </select>
                                <input type="text" value={filter.value} onChange={e => handleFilterChange(filter.id, 'value', e.target.value)} className="cyber-input text-xs flex-grow w-1/3"/>
                                <button onClick={() => handleRemoveFilter(filter.id)} className="text-gray-500 hover:text-red-400 p-1"><XIcon className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-900/50">
                        <h4 className="font-mono text-sm text-blue-400 tracking-wider mb-2">// SORTING & LIMIT</h4>
                         <div className="flex gap-2">
                            <select value={sort.column} onChange={e => setSort(prev => ({...prev, column: e.target.value}))} className="cyber-select text-xs flex-grow">
                                <option value="">-- sort by column --</option>
                                {allColumnsInSchema.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                             <select value={sort.direction} onChange={e => setSort(prev => ({...prev, direction: e.target.value as any}))} className="cyber-select text-xs">
                                <option>ASC</option><option>DESC</option>
                            </select>
                             <input type="number" placeholder="LIMIT" value={limit} onChange={e => setLimit(e.target.value)} className="cyber-input text-xs w-20"/>
                         </div>
                    </div>
                </div>
                <div className="font-mono text-green-400 text-xs h-4 mt-2 text-center">{builderFeedback}</div>
            </div>
        </aside>

        <main className="flex-grow relative overflow-hidden flex flex-col p-4 gap-4">
            <div className="flex-grow-[2] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// QUERY_EDITOR</h3>
                    <button onClick={() => handleRunQuery()} className="cyber-button cyber-button-primary text-sm flex items-center gap-2"><PlayIcon className="w-4 h-4"/> Run Query</button>
                </div>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="cyber-textarea font-mono text-sm flex-grow w-full h-full"
                    placeholder="Enter your SQL query here..."
                />
            </div>

            <div className="flex-grow-[3] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                         <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// RESULTS</h3>
                         <button onClick={() => setView('table')} className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${view === 'table' ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>Table</button>
                         <button onClick={() => setView('chart')} className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${view === 'chart' ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>Chart</button>
                    </div>
                    {error && <p className="text-red-400 text-xs font-mono text-right truncate" title={error}>{error}</p>}
                </div>
                
                <div className="flex-grow cyber-panel p-2 relative scanline-overlay overflow-hidden">
                    {view === 'table' ? (
                        <div className="w-full h-full overflow-auto cyber-scrollbar text-sm">
                            {results.length > 0 ? (
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
                                        <tr>{Object.keys(results[0]).map(key => <th key={key} className="p-2 font-semibold text-left border-b border-blue-900/50">{key}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {paginatedResults.map((row, i) => (
                                            <tr key={i} className="border-b border-blue-900/30 hover:bg-blue-900/20">{Object.values(row).map((val, j) => <td key={j} className="p-2 whitespace-nowrap">{String(val)}</td>)}</tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (<div className="w-full h-full flex items-center justify-center text-gray-600 font-mono">// NO_RESULTS_TO_DISPLAY //</div>)}
                        </div>
                    ) : (
                         <div className="w-full h-full flex flex-col p-2 gap-2">
                            {results.length > CHART_ROW_LIMIT && <p className="text-xs text-yellow-400 font-mono text-center flex-shrink-0">Note: Chart is only showing the first {CHART_ROW_LIMIT} rows for performance.</p>}
                            <div className="flex-grow relative">
                                <canvas ref={chartRef}></canvas>
                            </div>
                            {results.length > 0 && (
                                <div className="flex gap-2 items-center justify-center p-2 bg-black/30 rounded-md flex-shrink-0 text-sm">
                                    <label>Type:</label>
                                    <select value={chartConfig.type} onChange={e => setChartConfig(p => ({...p, type: e.target.value as any}))} className="cyber-select text-xs">
                                        <option value="bar">Bar</option><option value="line">Line</option><option value="pie">Pie</option><option value="doughnut">Doughnut</option><option value="radar">Radar</option><option value="polarArea">Polar Area</option>
                                    </select>
                                    <label>X-Axis:</label>
                                    <select value={chartConfig.xAxisColumn} onChange={e => setChartConfig(p => ({...p, xAxisColumn: e.target.value}))} className="cyber-select text-xs">
                                        {Object.keys(results[0]).map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                    <label>Y-Axis:</label>
                                     <select value={chartConfig.yAxisColumn} onChange={e => setChartConfig(p => ({...p, yAxisColumn: e.target.value}))} className="cyber-select text-xs">
                                        {Object.keys(results[0]).map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                            )}
                         </div>
                    )}
                </div>
                 {view === 'table' && results.length > ROWS_PER_PAGE && (
                    <div className="flex justify-center items-center gap-4 mt-2 text-sm flex-shrink-0">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="cyber-button cyber-button-secondary text-xs disabled:opacity-50">Prev</button>
                        <span className="font-mono">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="cyber-button cyber-button-secondary text-xs disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>
        </main>
      </div>
      <footer className="w-full bg-gray-900/50 backdrop-blur-lg border-t border-blue-900/50 p-1.5 flex items-center z-10 flex-shrink-0">
        <p className="font-mono text-xs text-gray-400 px-2">{status}</p>
      </footer>
    </div>
  );
};

// Add default export for the DataPlayground component
export default DataPlayground;