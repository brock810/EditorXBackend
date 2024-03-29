const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

let installedPlugins = [];


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 );
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files'), (req, res) => {
    try {
        const uploadedFiles = req.files.map(file => ({
            name: file.filename,
            size: file.size
        }));
        console.log('Files uploaded successfully:', uploadedFiles);
        res.status(200).json ({ message: 'Files uploaded successfully', files: uploadedFiles });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Internal server error '});
    }
});

app.use(express.static('public'));


app.get('/plugins', (_req, res) => {
    res.json({ plugins: installedPlugins });
});

app.post('/install-plugin', (req, res) => {
    const { name } = req.body;

    // Execute npm install command
    const installProcess = exec(`npm install --force ${name}`);

    // Capture output streams
    installProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    installProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Handle process exit
    installProcess.on('exit', (code) => {
        if (code === 0) {
            console.log(`npm install process exited with code ${code}`);
            res.status(200).json({ success: true, message: `Package ${name} installed successfully` });
        } else {
            console.error(`npm install process exited with code ${code}`);
            res.status(500).json({ success: false, message: `Error installing package ${name}` });
        }
    });

    // Handle process error
    installProcess.on('error', (err) => {
        console.error(`npm install process encountered an error: ${err}`);
        res.status(500).json({ success: false, message: `Error installing package ${name}: ${err.message}` });
    });
});


app.delete('/plugins/:pluginName', (req, res) => {
    const { pluginName } = req.params;

    installedPlugins = installedPlugins.filter(plugin => plugin.name !== pluginName);
    res.json({ message: `plugin ${pluginName} removed successfully `});
});


app.get('/files', (_req, res) => {
    const filesInDirectory = fs.readdirSync(path.join(__dirname, 'files'));
    res.json({ files: filesInDirectory });
});

app.post('/create', (req, res) => {
    const { fileName, language } = req.body;
    if (!fileName || !language) {
        return res.status(400).json({ error: 'File name and language are required' });
    }

    // Determine file extension based on the selected language
    let fileExtension = '';
    switch (language.toLowerCase()) {
        case 'javascript':
            fileExtension = '.js';
            break;
        case 'python':
            fileExtension = '.py';
            break;
        case 'java':
            fileExtension = '.java';
            break;
        case 'html':
            fileExtension = '.html';
            break;
        case 'css':
            fileExtension = '.css';
            break;
        case 'typescript':
            fileExtension = '.ts';
            break;
        case 'c':
            fileExtension = '.c';
            break;
        case 'cpp':
            fileExtension = '.cpp';
            break;
        case 'csharp':
            fileExtension = '.cs';
            break;
        case 'ruby':
            fileExtension = '.rb';
            break;
        case 'swift':
            fileExtension = '.swift';
            break;
        case 'go':
            fileExtension = '.go';
            break;
        case 'rust':
            fileExtension = '.rs';
            break;
        case 'php':
            fileExtension = '.php';
            break;
        case 'kotlin':
            fileExtension = '.kt';
            break;
        case 'scala':
            fileExtension = '.scala';
            break;
        case 'r':
            fileExtension = '.r';
            break;
        case 'perl':
            fileExtension = '.pl';
            break;
        case 'haskell':
            fileExtension = '.hs';
            break;
        case 'lua':
            fileExtension = '.lua';
            break;
        case 'sql':
            fileExtension = '.sql';
            break;
        case 'assembly':
            fileExtension = '.asm';
            break;
        case 'shell':
            fileExtension = '.sh';
            break;
        default:
            fileExtension = '.txt'; 
    }
    

    // Construct the file path
    const filePath = path.join(__dirname, 'files', fileName + fileExtension);

    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        // Fetch the updated list of files
        const updatedFiles = fs.readdirSync(path.join(__dirname, 'files'));
        
        // Send back the updated list of files in the response
        res.status(201).json({ message: 'File created successfully', files: updatedFiles });
    });
});

app.post('/rename', (req, res) => {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
        return res.status(400).json({ error: 'Old and new file names are required' });
    }
    const oldFilePath = path.join(__dirname, 'files', oldName);
    const newFilePath = path.join(__dirname, 'files', newName);
    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ message: 'File renamed successfully' });
    });
});

app.delete('/files/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, 'files', fileName);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ message: 'File deleted successfully' });
    });
});

app.post('/install-dependencies', (_req, res) => {
    const scriptPath = path.join(__dirname, 'install_dependencies.bat');
    
    // Check if the batch script exists
    if (!fs.existsSync(scriptPath)) {
        console.error('Batch script not found');
        return res.status(500).json({ error: 'Batch script not found' });
    }
    
    // Execute the batch script to install dependencies
    exec(scriptPath, { timeout: 600000 }, (err, _stdout, _stderr) => {
        if (err) {
            console.error('Error during installation:', err);
            return res.status(500).json({ error: 'Installation failed', stderr: err.message });
        }
        console.log('Installation completed successfully');
        
        // Check if dependencies were installed successfully
        checkDependencies(res);
    });
});

function checkDependencies(res) {
    const checkScriptPath = path.join(__dirname, 'check_dependencies.bat');
    
    // Check if the check dependencies batch script exists
    if (!fs.existsSync(checkScriptPath)) {
        console.error('Check dependencies batch script not found');
        return res.status(500).json({ error: 'Check dependencies batch script not found' });
    }
    
    // Execute commands to check if dependencies were installed
    exec(checkScriptPath, (err, stdout, stderr) => {
        if (err) {
            console.error('Error checking dependencies:', err);
            return res.status(500).json({ error: 'Error checking dependencies', stderr: err.message });
        }
        console.log('Dependencies checked successfully');
        console.log(stdout);
        res.json({ message: 'Installation completed successfully' });
    });
}

app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


app.post('/runcode', (req, res) => {
    const { code, language } = req.body;

    // Check if the code and language are provided
    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }

    let command;
    let languageFlag;
    switch (language) {
        case 'javascript':
            command = 'node';
            languageFlag = '';
            break;
        case 'python':
            command = 'python';
            languageFlag = ''; 
            break;
        case 'java':
            command = 'java';
            languageFlag = '';
            break;
        case 'typescript':
            command = 'ts-node'; 
            languageFlag = ''; 
            break;
        case 'c':
            command = 'gcc'; 
            languageFlag = '-o temp && ./temp';
            break;
        case 'cpp':
            command = 'g++'; 
            languageFlag = '-o temp && ./temp'; 
            break;
        case 'csharp':
            command = 'dotnet'; 
            languageFlag = 'temp.cs'; 
            break;
        case 'ruby':
            command = 'ruby'; 
            languageFlag = ''; 
            break;
        case 'swift':
            command = 'swift'; 
            languageFlag = 'temp.swift'; 
            break;
        case 'go':
            command = 'go'; 
            languageFlag = 'run'; 
            break;
        case 'rust':
            command = 'rustc'; 
            languageFlag = '-o temp && ./temp'; 
            break;
        case 'php':
            command = 'php'; 
            languageFlag = ''; 
            break;
        case 'kotlin':
            command = 'kotlin'; 
            languageFlag = ''; 
            break;
        case 'scala':
            command = 'scala'; 
            languageFlag = ''; 
            break;
        case 'r':
            command = 'R'; 
            languageFlag = ''; 
            break;
        case 'perl':
            command = 'perl'; 
            languageFlag = ''; 
            break;
        case 'haskell':
            command = 'runhaskell'; 
            languageFlag = ''; 
            break;
        case 'lua':
            command = 'lua'; 
            languageFlag = ''; 
            break;
        case 'sql':
            command = 'sql'; 
            languageFlag = ''; 
            break;
        case 'assembly':
            command = 'as'; 
            languageFlag = ''; 
            break;
        case 'shell':
            command = 'sh'; 
            languageFlag = ''; 
            break;
        case 'html':
            res.json({ output: code, error: '' });
            return; 
        case 'css':
            res.json({ output: 'CSS code executed successfully!', error: '' });
            return; 
        default:
            return res.status(400).json({ error: 'Unsupported language' });
    }

    // Spawn a child process to execute the code
    const childProcess = exec(`${command} ${languageFlag}`, { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) {
            if (err.killed) {
                return res.status(500).json({ error: 'Execution timed out' });
            } else {
                console.error('Error during execution:', err);
                return res.status(500).json({ error: 'Execution failed', stderr: err.message });
            }
        }
        res.json({ output: stdout, error: stderr });
    });

    // Handle errors related to the child process
    childProcess.on('error', (err) => {
        console.error('Error starting child process:', err);
        return res.status(500).json({ error: 'Failed to start child process', stderr: err.message });
    });

    // Handle timeout if the child process takes too long to execute
    childProcess.on('timeout', () => {
        childProcess.kill();
        return res.status(500).json({ error: 'Execution timed out' });
    });

    // Pass the code as input to the child process
    childProcess.stdin.write(code);
    childProcess.stdin.end(); // End the input stream
});

app.get('/check-dependencies', (req, res) => {
    exec('check_dependencies.bat', (err, stdout, stderr) => {
        if (err) {
            console.error('Error checking dependencies:', err);
            return res.status(500).json({ error: 'Error checking dependencies', stderr: err.message });
        }
        console.log('Dependencies checked successfully');
        console.log(stdout);

        // Check if all dependencies are installed
        if (stdout.includes('All dependencies are installed')) {
            // Send a success message to the frontend
            return res.json({ message: 'All dependencies are installed', output: stdout });
        } else {
            // Send a message indicating that some dependencies are missing
            return res.json({ message: 'Some dependencies are missing', output: stdout });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
