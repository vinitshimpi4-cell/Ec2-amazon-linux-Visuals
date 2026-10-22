# amazon-linux-ec2-connect-visual

An animated, beginner-friendly guide that follows **Ravi** as he launches an **Amazon Linux 2023** EC2 instance and connects to it, with and without a key pair. Pure HTML, CSS and JavaScript. No build step, no JavaScript dependencies. **#Buildwithvinit**

## The story map

| Real thing | In the story |
|---|---|
| AWS | Cloud city |
| EC2 instance | Rented computer |
| Amazon Linux | Operating system |
| Public IP | Computer address |
| SSH | Secure tunnel |
| Port 22 | Staff entrance |
| Security group | Door guard |
| Key pair | Digital key |
| EC2 Instance Connect | Browser-based access desk |
| Terminal | Control room |
| `ec2-user` | Login identity |

## Connection methods

| Method | Needs key pair? | Use it when |
|---|---|---|
| EC2 Instance Connect (browser) | No | Quickest first login; needs public IPv4, port 22 open to the Instance Connect range, IAM permission `ec2-instance-connect:SendSSHPublicKey` |
| CMD / PowerShell (OpenSSH) | Yes (.pem) | Windows 10/11 built-in client |
| Git Bash | Yes (.pem) | You already use Git for Windows |
| MobaXterm | Yes (.pem) | You prefer a GUI with tabs and file transfer |
| PuTTY | Yes (.ppk) | Convert .pem to .ppk with PuTTYgen first |

Core command: `ssh -i my-key.pem ec2-user@PUBLIC-IP`

## The ten steps

### Step 1: Open the AWS Console and select a Region

**In plain words:** Ravi walks into the cloud city (AWS) and picks the district (Region) where his rented computer will live. Closer districts feel faster.

**Technical:** Sign in at console.aws.amazon.com. EC2 resources are Region-scoped: an instance in Mumbai (ap-south-1) is invisible in N. Virginia (us-east-1). Pick a Region near you and stay in it for the whole tutorial.

**Console actions:**
1. Sign in to the AWS Management Console.
2. Use the Region selector in the top-right corner.
3. Choose a Region, for example Asia Pacific (Mumbai) ap-south-1.
4. Search for EC2 in the top search bar.

```bash
# Console only for this step. Optional CLI check:
aws configure get region
```

### Step 2: Go to EC2, Instances, Launch instances

**In plain words:** EC2 is the rental desk for computers. Ravi clicks the button to rent a new one.

**Technical:** EC2 (Elastic Compute Cloud) provides virtual servers called instances. The launch wizard collects name, image, size, key, network and storage in one page.

**Console actions:**
1. Open EC2 from the search bar.
2. Left menu: Instances → Instances.
3. Click the orange Launch instances button.

```bash
# Console only. CLI equivalent comes later:
aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId"
```

### Step 3: Name the instance and choose Amazon Linux 2023

**In plain words:** Ravi labels his computer and chooses its operating system, Amazon Linux 2023, the one AWS builds and supports.

**Technical:** The name becomes a Name tag. The AMI (Amazon Machine Image) is the template for the root disk. Amazon Linux 2023 (AL2023) ships with SSH, EC2 Instance Connect, the AWS CLI and the default user ec2-user.

**Console actions:**
1. Name: ravi-first-server.
2. Application and OS Images: choose Amazon Linux.
3. AMI: Amazon Linux 2023 AMI, Free tier eligible, 64-bit (x86 or Arm).

```bash
# Find the latest AL2023 AMI ID (optional):
aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text
```

### Step 4: Choose instance type and storage

**In plain words:** Ravi picks how strong the computer is and how big its disk is. A small one is enough to learn and may cost nothing.

**Technical:** t3.micro or t2.micro (Region dependent) is marked Free tier eligible. Newer AWS accounts get a credit-based Free Tier plan, older ones 750 hours a month for 12 months; check your Billing page because eligibility depends on account age and Region. Default root volume is gp3 8 GiB. Stop or terminate when done.

**Console actions:**
1. Instance type: pick the one labelled Free tier eligible (for example t3.micro).
2. Configure storage: keep 8 GiB gp3.
3. Review the Free tier note shown in the Summary panel.

```bash
# List free-tier eligible types in your Region:
aws ec2 describe-instance-types --filters Name=free-tier-eligible,Values=true --query "InstanceTypes[].InstanceType"
```

### Step 5: Key pair: create one, or proceed without

**In plain words:** A key pair is a digital key. Ravi can cut a key and keep it safe (for his own terminal), or skip it and use the browser access desk instead.

**Technical:** Option A, with key pair: create RSA or ED25519, format .pem (OpenSSH) or .ppk (PuTTY). AWS stores the public key; you download the private key once. Option B, Proceed without a key pair (Not recommended): allowed, and you can still connect with EC2 Instance Connect in the browser, which pushes a temporary public key. Without a key you cannot SSH from your own terminal later.

**Console actions:**
1. Key pair (login): click Create new key pair.
2. Name: my-key, type RSA, format .pem (use .ppk for PuTTY).
3. Save the downloaded my-key.pem somewhere safe. It cannot be downloaded again.
4. Or choose Proceed without a key pair for browser-only access.

```bash
# Create a key from the CLI instead:
aws ec2 create-key-pair --key-name my-key --query KeyMaterial --output text > my-key.pem
```

### Step 6: Network: VPC, public subnet, public IP, security group

**In plain words:** Ravi puts the computer on a road that leads to the internet, gives it a public address, and hires a door guard who only opens the staff entrance (port 22).

**Technical:** Use a VPC whose subnet has a route 0.0.0.0/0 to an Internet Gateway (a public subnet). Enable Auto-assign public IPv4 address. Security group inbound rule: SSH, TCP 22, source = My IP (best) or the EC2 Instance Connect range for your Region. Never leave 0.0.0.0/0 on port 22 for real servers.

**Console actions:**
1. Network settings → Edit.
2. VPC: default VPC is fine for learning.
3. Subnet: pick a public subnet; Auto-assign public IP: Enable.
4. Firewall: Create security group, rule SSH, port 22, Source type My IP.

```bash
# Check that your subnet is public:
aws ec2 describe-route-tables --query "RouteTables[].Routes[?GatewayId!=null]"
```

### Step 7: Launch, wait for Running and status checks

**In plain words:** Ravi presses Launch. The computer switches on. He waits for green lights before knocking.

**Technical:** Instance state goes pending, then running. Status checks take 1 to 3 minutes: System status (AWS hardware) and Instance status (OS reachable) should show 2/2 checks passed. Note the Public IPv4 address from the Details tab.

**Console actions:**
1. Review the Summary, then click Launch instance.
2. Click View all instances.
3. Wait for Instance state: Running and Status check: 2/2 checks passed.
4. Select the instance and copy the Public IPv4 address.

```bash
aws ec2 wait instance-status-ok --instance-ids i-0123456789abcdef0
aws ec2 describe-instances --instance-ids i-0123456789abcdef0 --query "Reservations[].Instances[].PublicIpAddress"
```

### Step 8: Connect without a key pair: EC2 Instance Connect

**In plain words:** Ravi walks to the browser access desk. AWS sends a one-time key to the computer for him, and a control room opens right in the browser.

**Technical:** EC2 Instance Connect pushes a temporary public key (valid 60 seconds) and opens a browser SSH session to ec2-user. Requirements: instance Running with a public IPv4; security group allows TCP 22 from the Instance Connect IP range of your Region; IAM permission ec2-instance-connect:SendSSHPublicKey; AL2023 (EC2 Instance Connect preinstalled). No public IP? Use an EC2 Instance Connect Endpoint.

**Console actions:**
1. EC2 → Instances → select the instance → Connect.
2. Tab: EC2 Instance Connect.
3. Connection type: Connect using a Public IP.
4. Username: ec2-user, then click Connect.

```bash
# Browser needs no command. CLI version:
aws ec2-instance-connect ssh --instance-id i-0123456789abcdef0 --os-user ec2-user
```

### Step 9: Connect with a key pair: CMD, PowerShell, Git Bash, MobaXterm, PuTTY

**In plain words:** Ravi uses his own control room (terminal) and shows his digital key to the door guard. If the key fits, he is let in as ec2-user.

**Technical:** Windows 10/11 include the OpenSSH client (CMD, PowerShell). Git Bash also ships ssh. Private key permissions must be locked to you. PuTTY cannot read .pem: convert to .ppk with PuTTYgen, then set Host ec2-user@PUBLIC-IP and Connection → SSH → Auth → Credentials → private key. MobaXterm: Session → SSH, Remote host = public IP, tick Specify username = ec2-user, Advanced SSH settings → Use private key.

**Console actions:**
1. Copy the Public IPv4 from the instance details.
2. Open CMD, PowerShell or Git Bash in the folder with my-key.pem.
3. Fix key permissions, then run the ssh command.
4. Type yes at the host fingerprint prompt the first time.

```bash
ssh -i my-key.pem ec2-user@PUBLIC-IP

# Windows key permissions (CMD/PowerShell):
icacls my-key.pem /inheritance:r
icacls my-key.pem /grant:r "%USERNAME%":R

# Git Bash, Linux, macOS:
chmod 400 my-key.pem
```

### Step 10: Verify the connection and fix problems

**In plain words:** Ravi asks the computer who he is and where he is. If the door stays shut, he checks the guard, the road, the address and the key.

**Technical:** Timeout: security group lacks port 22 from your IP, or no public IP, or the subnet route table has no 0.0.0.0/0 to the Internet Gateway (also check network ACLs). Permission denied (publickey): wrong username (use ec2-user on AL2023), wrong .pem, or key permissions too open (UNPROTECTED PRIVATE KEY FILE). No public IP: enable auto-assign or attach an Elastic IP. Wrong security group: confirm it is attached to the instance. Host changed warning: stop/start gave a new IP; remove the old known_hosts entry.

**Console actions:**
1. Run the five checks below inside the session.
2. Timeout? Check security group, public IP and route table.
3. Permission denied? Check username ec2-user and the key file.
4. When finished, stop or terminate the instance to avoid charges.

```bash
whoami          # ec2-user
hostname        # ip-172-31-x-x.ap-south-1.compute.internal
pwd             # /home/ec2-user
cat /etc/os-release   # Amazon Linux 2023
ip addr         # shows the private IP

# Debug from your laptop:
ssh -v -i my-key.pem ec2-user@PUBLIC-IP
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| SSH timeout | Security group has no port 22 rule for your IP | Add inbound SSH, TCP 22, source My IP |
| SSH timeout | No public IPv4 address | Enable auto-assign public IP or attach an Elastic IP |
| SSH timeout | Routing: subnet has no 0.0.0.0/0 route to the Internet Gateway | Fix the route table (and check network ACLs) |
| Wrong security group | Rule added to a group not attached to the instance | Instance → Security → change security groups |
| Permission denied (publickey) | Wrong username | Use `ec2-user` on Amazon Linux 2023 |
| Permission denied (publickey) | Wrong key or instance launched without that key | Use the matching .pem, or use Instance Connect |
| UNPROTECTED PRIVATE KEY FILE | Key permissions too open | `chmod 400 my-key.pem` or `icacls` commands in Step 9 |
| Instance Connect fails | Missing IAM permission or range not allowed | Allow the Region's EC2_INSTANCE_CONNECT IP range on port 22 |
| Host key changed | Public IP changed after stop/start | `ssh-keygen -R PUBLIC-IP` |

## Run locally

```bash
cd amazon-linux-ec2-connect-visual
python3 -m http.server 8080     # or: npx serve .
# open http://localhost:8080
```
Opening `index.html` directly also works.

## Deploy to GitHub Pages

1. Create a repository and push all files (keep `.nojekyll`).
2. Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
3. Visit `https://YOUR-USER.github.io/amazon-linux-ec2-connect-visual/`.

## Customize

- **Steps and text:** edit the `STEPS` array at the top of `js/app.js` (`t` title, `s` subtitle, `plain`, `tech`, `act`, `cmd`, `watch`, `story`, `term` lines).
- **Which parts light up:** `hl` lists element ids (`cloud, browser, key, term, igw, vpc, sub, sg, door, ec2`, each `e-<name>` in `index.html`). `pk` lists packets: `B` browser request, `T` terminal request, `K` key, `C` temporary key, `X` rejected, `G` success.
- **Packet routes:** edit the `<path>` elements in `<defs>` of the SVG; packets follow them with `animateMotion` and `mpath`.
- **Colors and fonts:** CSS variables at the top of `css/style.css`.
- **Accessibility:** focus outlines are visible, and `prefers-reduced-motion` pauses the animation and hides moving packets.

Free tier rules and console labels change over time; check the AWS documentation for current details.

MIT licensed. Made with care for beginners. **#Buildwithvinit**
