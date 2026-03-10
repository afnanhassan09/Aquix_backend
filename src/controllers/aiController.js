const { spawn } = require('child_process');
const path = require('path');

// Absolute path to the compiled Python executable
const NOTEBOOK_EXE = path.resolve(
    __dirname,
    '../services/notebook.exe'
);

/**
 * POST /api/ai/analyze
 * Body: { company: string, tier: 1 | 2 | 3 }
 * Returns the AI analysis JSON produced by notebook.exe
 */
const analyzeCompany = (req, res) => {
    const { company, tier } = req.body;

    if (!company || !tier) {
        return res.status(400).json({ error: 'Missing required fields: company, tier' });
    }

    const tierInt = parseInt(tier, 10);
    if (![1, 2, 3].includes(tierInt)) {
        return res.status(400).json({ error: 'tier must be 1, 2, or 3' });
    }

    let stdout = '';
    let stderr = '';

    const proc = spawn(NOTEBOOK_EXE, ['--company', company, '--tier', String(tierInt)]);

    proc.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    proc.on('error', (err) => {
        console.error('[AI] Failed to start notebook.exe:', err.message);
        return res.status(500).json({ error: 'Failed to start AI process', details: err.message });
    });

    proc.on('close', (code) => {
        if (code !== 0) {
            console.error('[AI] notebook.exe exited with code', code, '\nstderr:', stderr);
            return res.status(500).json({ error: 'AI process failed', details: stderr });
        }

        // notebook.exe prints debug lines before the final JSON.
        // Extract the LAST valid JSON object from stdout (the final result).
        try {
            const allMatches = [...stdout.matchAll(/\{[\s\S]*?\}/g)];
            if (!allMatches.length) {
                throw new Error('No JSON found in output');
            }
            // The last match is the clean final result block
            const lastMatch = allMatches[allMatches.length - 1][0];
            const result = JSON.parse(lastMatch);
            return res.status(200).json(result);
        } catch (parseErr) {
            console.error('[AI] Could not parse JSON from stdout:', stdout);
            return res.status(500).json({ error: 'Failed to parse AI output', raw: stdout });
        }
    });
};

module.exports = { analyzeCompany };
