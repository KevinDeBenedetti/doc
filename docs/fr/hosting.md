<!-- Translated on 26/04/2025 -->

```
# Hosting

::: details Table of content
[[toc]]
:::

## SSH

### Login
```sh
ssh <username>@<ip_vps>
```

### Login with key
```sh
ssh -i ~/.ssh/<key_name>.pub <username>@<ip_vps>
```

### Alias

#### Create an alias

In the file `~/.ssh/config`, create an alias with the private key.
```sh
Host <alias_name>
  Hostname <ip_vps>
  User <username>
  IdentityFile ~/.ssh/<key_name>
  IdentitiesOnly yes
```

#### Login with alias

```sh
ssh <alias_name>
```

### Configure a ssh key

1. Copy the public key on the remote server
2. Configure automatically the rights
3. Add the key to the file `authorized_keys` on the remote server

```sh
ssh-copy-id -i ~/.ssh/<key_name>.pub <username>@<ip_vps>
```

### Copy

#### Copy a file with ssh
```sh
scp -r <file_name> <username>@<ip_vps>:~/
```

#### Copy a file with ssh, on a personnalize port
```sh
scp -r -P <port> <file_name> <username>@<ip_vps>:~/
```

### Delete

```sh
ssh-keygen -R <ip_vps>
```

### Login to a remote a server

1. Create a ssh key
Create a pair of ssh keys on local.
```sh
ssh-keygen -t rsa -b 4096 -C "email@email.email" -f ~/.ssh/<key_name>
```

2. Add the ssh public key on the remote server
Copy the key with this command.
```sh
pbcopy < ~/.ssh/<key_name>.pub
```

3. Login to the vps
```sh
ssh -i ~/.ssh/<key_name> root@<ip_vps>
```

### Authorized a key in the `authorised_keys` file
```sh
echo "<public_keys>" >> ~/.ssh/authorised_keys
```

## Firewall

The firewall is a security system that filters incoming and outgoing connections.

- Incoming traffic : Allow only the ports required.
- Outbound traffic : Generally, allow everything except for specific needs.

### Necessary rules

| Protocol | PORT |
|:--------:|:----:|
| SSH      | 22  |
| HTTP     | 80   |
| HTTPS    | 443  |
| DNS      | 53   |
| SMTP     | 25   |
| IMAP     | 143  |
| POP3     | 110  |
| FTP      | 21   |

### Incoming traffic

| Protocol | Source IP | Source Port | Destination IP |	Destination Port | Action |
|:--------:|:---------:|:-----------:|:--------------:|:----------------:|:------:|
| TCP      | 0.0.0.0/0 | Any         |	VPS IP        |	22 / SSH	       | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         |	VPS IP        |	80 / HTTP	       | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | 0.0.0.0/0      |	Any     	       | ACCEPT |

### Outbound traffic

| Protocol | Source IP | Source Port | Destination IP |	Destination Port | Action |
|:--------:|:---------:|:-----------:|:--------------:|:----------------:|:------:|
| All      | VPS IP    | Any         | 0.0.0.0/0      |	Any     	       | ACCEPT |
```