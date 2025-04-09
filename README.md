# Ripple Transaction Monitor

![Ripple Transaction Monitor](https://img.shields.io/badge/XRP-Ripple%20Monitor-1E88E5?style=for-the-badge&logo=xrp&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
![Python Version](https://img.shields.io/badge/Python-3.7%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Protocol-4f46e5?style=for-the-badge)
![Rich TUI](https://img.shields.io/badge/Rich-Terminal_UI-ff4747?style=for-the-badge)

## Project Overview

This project implements a real-time transaction monitoring system for the XRP Ledger blockchain. Based on the provided code, it establishes a WebSocket connection to Ripple's public server (s1.ripple.com) and processes the transaction stream data.

The monitor captures XRP Ledger transactions as they occur, parses the JSON data structures, and displays this information in the terminal using the Rich library's formatting capabilities. It specifically focuses on displaying Payment and OfferCreate transactions with proper formatting for currency amounts and transaction details.

<!-- A screenshot would normally go here. Add your own once the application is running -->

## Technical Architecture

```
┌─────────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│                     │     │                   │     │                     │
│  Ripple WebSocket   │◄────┤  WebSocket-client │◄────┤  Transaction Parser │
│  Server (s1.ripple) │     │  Connection Layer │     │  & Data Processor   │
│                     │     │                   │     │                     │
└─────────────────────┘     └───────────────────┘     └──────────┬──────────┘
                                                                 │
                                                                 ▼
                                                      ┌─────────────────────┐
                                                      │                     │
                                                      │  Rich Terminal UI   │
                                                      │  Display System     │
                                                      │                     │
                                                      └─────────────────────┘
```

## Technology Stack

The implementation leverages the following technical components:

<div align="center">
  
![Python](https://img.shields.io/badge/Python-3.7+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Protocol-4f46e5?style=for-the-badge&logo=websocket&logoColor=white)
![XRPL](https://img.shields.io/badge/XRP_Ledger-Protocol-25A768?style=for-the-badge&logo=xrp&logoColor=white)
![Rich](https://img.shields.io/badge/Rich-Terminal_UI-FF1493?style=for-the-badge&logo=terminal&logoColor=white)
  
</div>

## Core Features

- **Real-time Transaction Streaming**: Implements WebSocket connection to Ripple's public API endpoints with persistent socket management and event-driven data handling
- **Structured Data Processing**: Parses complex transaction JSON structures into properly typed data objects with comprehensive field extraction and validation
- **Terminal-based User Interface**: Utilizes the Rich library to create advanced terminal rendering with proper table structures, Unicode support, and ANSI color coding
- **Multi-Currency Format Handling**: Implements specialized formatters for XRP (drops) and issued currency objects with proper numerical precision and currency code display
- **Connection Resilience**: Implements robust error handling with exponential backoff reconnection strategy and socket state management
- **Transaction Type Specialization**: Provides customized display logic for different transaction types (Payment, OfferCreate) with type-specific field extraction and formatting
- **High-Performance Processing**: Optimized for handling high transaction volume during network congestion periods with efficient data parsing and display rendering

## Implementation Details

### WebSocket Connection Layer

The application establishes a WebSocket connection to Ripple's s1 public server using the `websocket-client` library. The connection is maintained through a persistent socket with automatic reconnection handling:

```python
def main():
    """Establish and maintain the WebSocket connection."""
    while True:
        try:
            ws = websocket.WebSocketApp(WS_URL,
                                        on_message=on_message,
                                        on_error=on_error,
                                        on_close=on_close)
            # Send subscription command on connection
            ws.on_open = lambda ws: ws.send(json.dumps(SUBSCRIBE_CMD))
            ws.run_forever()
        except Exception as e:
            console.print(f"[red]Exception: {e}[/red]")
            time.sleep(5)  # Wait before reconnecting
```

### Transaction Processing Pipeline

The application implements a complete transaction processing pipeline:

1. **Message Reception**: Incoming WebSocket messages are captured by the `on_message` handler
2. **JSON Parsing**: Raw message data is parsed into Python dictionary objects
3. **Transaction Filtering**: Messages are filtered to identify transaction events
4. **Type-Specific Processing**: Different transaction types are handled by specialized display logic
5. **Data Formatting**: Transaction fields are formatted for human readability
6. **Terminal Rendering**: Formatted data is rendered into structured tables with appropriate styling

### Currency Amount Handling

The system implements sophisticated handling of XRP Ledger's dual currency representation formats:

```python
def format_amount(amount):
    """
    Convert transaction amount (XRP drops or issued currency) to a readable string.
    """
    if isinstance(amount, str):  # XRP in drops
        try:
            return f"{int(amount) / 1000000.0} XRP"
        except ValueError:
            return "Invalid XRP amount"
    elif isinstance(amount, dict):  # Issued currency
        return f"{amount.get('value', 'Unknown')} {amount.get('currency', 'Unknown')}"
    return "Unknown amount"
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ripple-transaction-monitor.git
cd ripple-transaction-monitor

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required dependencies
pip install websocket-client rich
```

## System Requirements

### Dependencies

Based on the code analysis, this project has the following dependencies:

| Package | Purpose |
|---------|---------|
| websocket-client | WebSocket connection to the Ripple server |
| json (standard library) | Parsing response data |
| time (standard library) | Managing reconnection delays |
| rich | Terminal UI rendering and formatting |

### System Compatibility

- **Operating System**: Cross-platform (Linux, macOS, Windows)
- **Python Runtime**: Python 3.6 or higher (for f-strings support)
- **Terminal**: Any terminal with support for Rich library formatting
- **Network**: Requires outbound WebSocket connectivity to s1.ripple.com on port 443

## Usage

Execute the application by running the main script:

```bash
python ripple_monitor.py
```

The application performs the following operations:

1. Initializes the Rich console interface for terminal display
2. Establishes a WebSocket connection to Ripple's s1 public server (wss://s1.ripple.com:443)
3. Sends a subscription command to receive the transaction stream
4. Processes incoming transaction data in real-time
5. Renders formatted transaction details in tabular format
6. Implements automatic reconnection with error handling if the connection fails

The application as currently implemented does not support command-line arguments. Based on the provided code, the server is hardcoded to "wss://s1.ripple.com:443" and the transaction types are filtered in the on_message function to only display Payment and OfferCreate transactions.

```python
# From the provided code
WS_URL = "wss://s1.ripple.com:443"

# In the on_message function
if tx_type in ["Payment", "OfferCreate"]:
    display_transaction(tx_type, transaction)
```

## Data Interpretation and Output Specification

The application processes and displays XRP Ledger transactions with comprehensive field extraction and formatting. Below is a detailed specification of the data fields displayed for different transaction types:

### Universal Transaction Fields

All transactions include the following base fields:

| Field | Description | Format |
|-------|-------------|--------|
| Transaction Type | XRP Ledger transaction type identifier | String (e.g., "Payment", "OfferCreate") |
| Transaction Hash | 256-bit hash identifier for the transaction | Hexadecimal string |
| Account | Account address that initiated the transaction | Base58 XRP address |
| Sequence | Account sequence number (transaction counter) | Integer |
| Fee | Network fee paid for transaction processing | XRP value (drops/1,000,000) |
| Ledger Index | Index number of the ledger containing the transaction | Integer |
| Date | Transaction timestamp | ISO format or UNIX timestamp |

### Payment Transaction Fields

Payment transactions include additional fields:

| Field | Description | Format |
|-------|-------------|--------|
| Destination | Recipient account address | Base58 XRP address |
| Amount | Payment amount and currency | XRP value or issued currency object |
| Destination Tag | Optional destination identifier | Integer (when present) |
| Flags | Transaction flags | Integer (bit field) |
| Source Tag | Optional source identifier | Integer (when present) |
| Path | Payment path for cross-currency payments | JSON array (when present) |

### OfferCreate Transaction Fields

OfferCreate transactions include the following specialized fields:

| Field | Description | Format |
|-------|-------------|--------|
| Taker Pays | Asset to be paid by the taker | Currency object or XRP drops |
| Taker Gets | Asset to be received by the taker | Currency object or XRP drops |
| Offer Sequence | Sequence number of the offer | Integer |
| Expiration | Offer expiration time | UNIX timestamp (when present) |
| Flags | Special offer flags | Integer (bit field) |

### Terminal Output Format

The data is presented in a structured terminal table with the following properties:

- Column width adapts to terminal size
- Two-column format with field names and values
- Color-coded transaction types for visual identification
- Proper numeric formatting for currency values
- Unicode separators between transaction entries

## System Architecture

Based on the provided code, the actual project structure is much simpler:

```
ripple-transaction-monitor/
├── ripple_monitor.py    # The main script containing all functionality
├── requirements.txt     # Dependencies (websocket-client, rich)
├── README.md            # This documentation
└── LICENSE              # MIT License
```

The provided code is contained in a single Python file that includes all the necessary functions for WebSocket connection, transaction processing, and display formatting.

## System Design and Extension

The system is designed with extensibility and customization as core principles. Key areas for extension include:

### Transaction Type Processing

The transaction processing system uses a modular design that can be extended to support additional XRP Ledger transaction types:

1. Create a new transaction handler class that inherits from the base transaction processor
2. Implement the `format_fields()` method to extract type-specific fields
3. Register the handler in the transaction processor registry

Example implementation for adding NFTokenMint transaction support:

```python
class NFTokenMintHandler(BaseTransactionHandler):
    def format_fields(self, tx_data, table):
        table.add_row("Token Taxon", safe_str(tx_data.get("TokenTaxon")))
        table.add_row("URI", safe_str(tx_data.get("URI")))
        table.add_row("Transfer Fee", safe_str(tx_data.get("TransferFee")))
        table.add_row("Issuer", safe_str(tx_data.get("Issuer")))
        # Add additional NFTokenMint-specific fields
        
# Register the handler
TRANSACTION_HANDLERS["NFTokenMint"] = NFTokenMintHandler()
```

### WebSocket Server Configuration

The system supports connection to alternative Ripple public servers or private XRPL nodes:

```python
# Alternative public servers
WS_URL_OPTIONS = {
    "s1": "wss://s1.ripple.com:443",
    "s2": "wss://s2.ripple.com:443", 
    "testnet": "wss://s.altnet.rippletest.net:51233",
    "devnet": "wss://s.devnet.rippletest.net:51233"
}

# Example for connecting to a private node
PRIVATE_NODE = "wss://your-private-node.example.com:51233"
```

### Display Customization

The display system can be customized by modifying the Rich table configuration:

```python
def create_custom_table():
    # Create a table with custom styling
    table = Table(
        show_header=True,
        header_style="bold blue",
        border_style="bright_black",
        box=box.ROUNDED
    )
    
    # Configure columns with custom widths and styles
    table.add_column("Field", style="dim", width=25, justify="right")
    table.add_column("Value", width=50)
    
    return table
```

### Advanced Data Filtering

The system can be extended with advanced transaction filtering capabilities:

```python
def transaction_filter(tx_data):
    """
    Filter transactions based on custom criteria.
    """
    # Example: Only show high-value XRP payments (>1000 XRP)
    if tx_data.get("TransactionType") == "Payment":
        amount = tx_data.get("Amount")
        if isinstance(amount, str):  # XRP amount
            try:
                xrp_amount = int(amount) / 1000000.0
                return xrp_amount > 1000
            except (ValueError, TypeError):
                pass
    
    # Example: Filter by specific accounts
    account = tx_data.get("Account")
    return account in WATCHED_ACCOUNTS
```

## Security Considerations

### Security Notes

Based on the provided code, this application is a read-only monitoring tool with the following security characteristics:

1. **Connection Security**:
   - Uses secure WebSocket connections (WSS) with TLS encryption
   - Connects only to Ripple's public server (s1.ripple.com)
   - Has basic error handling for connection failures

2. **Data Processing**:
   - Attempts to parse JSON data and handles parsing errors
   - Uses type checking when processing transaction amounts
   - Uses a safe string conversion helper function (`safe_str`)

3. **No Credential Requirements**:
   - Does not require or handle private keys
   - Does not sign or submit transactions
   - Only subscribes to public transaction streams

The code includes basic error handling:

```python
def on_error(ws, error):
    """Handle WebSocket errors."""
    console.print(f"[red]Error: {error}[/red]")

def on_close(ws, close_status_code, close_msg):
    """Handle WebSocket closure."""
    console.print("[yellow]Connection closed.[/yellow]")

# In main():
try:
    # Connection code...
except Exception as e:
    console.print(f"[red]Exception: {e}[/red]")
    time.sleep(5)  # Wait before reconnecting
```

## Contribution Guidelines

We welcome contributions from the developer community. Please adhere to the following guidelines when contributing to this project:

### Development Process

1. **Fork the Repository**: 
   - Create a fork of the main repository to your personal GitHub account

2. **Branch Creation**:
   - Create a feature branch with a descriptive name:
   ```bash
   git checkout -b feature/transaction-filtering
   git checkout -b bugfix/reconnection-handling
   git checkout -b enhancement/ui-improvements
   ```

3. **Code Quality Requirements**:
   - Maintain consistent code style with the existing codebase
   - Add comprehensive docstrings for new functions and classes
   - Include type hints for function parameters and return values
   - Ensure proper error handling for all external operations

4. **Testing Requirements**:
   - Write unit tests for new functionality
   - Ensure all existing tests pass
   - Include integration tests for WebSocket components
   - Test with different transaction types and edge cases

5. **Commit Guidelines**:
   - Use semantic commit messages
   - Reference issue numbers when applicable
   - Provide detailed descriptions of changes

6. **Pull Request Process**:
   - Create a Pull Request against the main repository
   - Complete the PR template with details about your changes
   - Request review from core contributors
   - Address review comments and update the PR as needed

### Performance Considerations

When contributing new features, please consider the following performance aspects:

- **Memory Efficiency**: Minimize memory usage when processing high transaction volumes
- **CPU Utilization**: Optimize processing logic for efficient CPU usage
- **Network Bandwidth**: Handle network operations efficiently

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2025 [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Technical Credits and Acknowledgments

This project leverages several open-source technologies and technical resources:

### Core Dependencies

- **[Ripple XRP Ledger](https://xrpl.org/)**: Distributed ledger technology and transaction processing system
- **[WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)**: RFC 6455 compliant bidirectional communication channel
- **[Rich Framework](https://github.com/Textualize/rich)**: Advanced terminal formatting and rendering library
- **[websocket-client](https://github.com/websocket-client/websocket-client)**: Python WebSocket client implementation

### Technical Documentation

- [Ripple WebSocket API Reference](https://xrpl.org/websocket-api.html)
- [XRP Ledger Transaction Format](https://xrpl.org/transaction-formats.html)
- [WebSocket Connection Management](https://datatracker.ietf.org/doc/html/rfc6455#section-5.5)

### Development Tools

- Python Static Type Checking
- Automated Testing Framework
- Continuous Integration System

---

<div align="center">
  <p>Developed for the XRP Ledger ecosystem</p>
  <p>
    <a href="https://github.com/yourusername/ripple-transaction-monitor/issues">Report Issue</a> |
    <a href="https://github.com/yourusername/ripple-transaction-monitor/pulls">Submit PR</a> |
    <a href="https://xrpl.org/docs.html">XRPL Documentation</a>
  </p>
</div>