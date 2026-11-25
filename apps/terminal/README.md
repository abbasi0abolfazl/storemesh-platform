# StoreMesh Terminal

Raspberry Pi-compatible web terminal for barcode, weighing and label workflows.

Device adapters are isolated from operational workflows so hardware can be simulated and tested independently.

`TcpLineDevice`, `ProtocolScale`, and `ProtocolPrinter` provide the production integration boundary for Ethernet/serial-gateway devices. A deployment must supply the certified device command, response pattern, timeout, network address and label language for its exact hardware model. The included simulated adapters are test doubles; this repository does not claim physical certification without a hardware acceptance run.
