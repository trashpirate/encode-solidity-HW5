import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage } from "wagmi";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

export default function InstructionsComponent() {
  return (
    <Grid>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Lottery dApp</h1>
        </div>
      </header>
      <Grid container direction="row" gap={2} sx={{ p: 6 }}>
        <WalletInfo></WalletInfo>
        <PageBody></PageBody>
      </Grid>
    </Grid>
  );
}

function PageBody() {
  const { address } = useAccount();
  return (
    <Grid container gap={4} direction="row">
      <Typography variant="h3" gutterBottom>
        {" "}
        Lottery Participant Actions{" "}
      </Typography>
      <Grid container direction="column" gap={4}>
        <Grid item sx={{ display: "flex", justifyContent: "flex-start", gap: "16px" }}>
          <GetRandom />
          <PurchaseTokens />
          <Bet />
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "16px",
            flexDirection: "column",
          }}
        >
          <PrizeWithdraw />
          <BetMany />
        </Grid>
      </Grid>
      <Typography variant="h3" gutterBottom>
        {" "}
        Lottery Admin Actions{" "}
      </Typography>
      <Grid container direction="column" gap={4}>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "16px",
            flexDirection: "column",
          }}
        >
          <OpenBets />
          <ReturnTokens />
        </Grid>
        <Grid item>
          <CloseLottery />
        </Grid>
      </Grid>
    </Grid>
  );
}
function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  return (
    <>
      {isConnecting ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        ""
      )}
      {address ? (
        <div>
          <Stack direction="column" spacing={2}>
            <Typography> Your account address is {address} </Typography>
            <Typography> Connected to the network {chain?.name} </Typography>
            <WalletBalance address={address}></WalletBalance>
          </Stack>
        </div>
      ) : (
        ""
      )}
      {isDisconnected ? (
        <div>
          <p>Connect wallet to continue</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

function GetRandom() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  if (isLoading) return <p> Getting random number... </p>;
  if (!data)
    return (
      <Button
        size="large"
        variant="contained"
        disabled={isLoading}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/get-randomNumber")
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Get Random Number
      </Button>
    );

  return (
    <div>
      <p> Random Number: {data}</p>
    </div>
  );
}

function PurchaseTokens() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<any>(0.001);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: tokenAmount }),
  };

  if (isLoading) return <p>Purchasing tokens... </p>;
  if (!data)
    return (
      <Box component="form" noValidate autoComplete="off">
        <Grid container direction="row" gap={2} alignItems="flex-end">
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="proposal-input"> Token Amount </InputLabel>
              <OutlinedInput
                id="proposal-input"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                label="Witdraw Amount"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="contained"
              disabled={isLoading}
              onClick={() => {
                setLoading(true);
                fetch("http://localhost:3001/purchaseTokens", requestOptions)
                  .then((res) => res.json())
                  .then((data) => {
                    setData(data);
                    setLoading(false);
                  });
              }}
            >
              Purchase Tokens
            </Button>
          </Grid>
        </Grid>
      </Box>
    );

  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function OpenBets() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [_openingTime, setOpeningTime] = useState("0");
  if (isLoading) return <p> Openning bets... </p>;
  if (!data)
    return (
      <>
        <Box component="form" noValidate autoComplete="off">
          <Grid container direction="row" gap={2} alignItems="flex-end">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="proposal-input"> Bet Duration </InputLabel>
                <OutlinedInput
                  id="proposal-input"
                  value={_openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  label="Bet Duration"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                size="large"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/openBets?closingTime=${Number(_openingTime)}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setData(data);
                      setLoading(false);
                    });
                }}
              >
                {" "}
                Open Bets{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  console.log(data);
  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function Bet() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <p> Betting... </p>;
  if (!data)
    return (
      <Button
        variant="contained"
        disabled={isLoading}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/bet")
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Bet
      </Button>
    );

  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function BetMany() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [_betMany, setBetMany] = useState("0");
  if (isLoading) return <p> Betting many... </p>;
  if (!data)
    return (
      <>
        <Box component="form" noValidate autoComplete="off">
          <Grid container direction="row" gap={2} alignItems="flex-end">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="proposal-input"> Bet Times </InputLabel>
                <OutlinedInput
                  id="proposal-input"
                  value={_betMany}
                  onChange={(e) => setBetMany(e.target.value)}
                  label="Bet Many Times"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                size="large"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/betMany?times=${Number(_betMany)}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setData(data);
                      setLoading(false);
                    });
                }}
              >
                {" "}
                Bet Many{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  console.log(data);
  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function CloseLottery() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <p> Closing Lottery... </p>;
  if (!data)
    return (
      <Button
        variant="contained"
        disabled={isLoading}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/closeLottery")
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Close Lottery
      </Button>
    );

  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function PrizeWithdraw() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [_withdraw, setWithdraw] = useState("0");
  if (isLoading) return <p> Betting many... </p>;
  if (!data)
    return (
      <>
        <Box component="form" noValidate autoComplete="off">
          <Grid container direction="row" gap={2} alignItems="flex-end">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="proposal-input"> Amount to Withdraw </InputLabel>
                <OutlinedInput
                  id="proposal-input"
                  value={_withdraw}
                  onChange={(e) => setWithdraw(e.target.value)}
                  label="Witdraw Amount"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                size="large"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/prizeWithdraw?amount=${Number(_withdraw)}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setData(data);
                      setLoading(false);
                    });
                }}
              >
                {" "}
                Withdraw Prize{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  console.log(data);
  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function OwnerWithdraw() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [_withdraw, setWithdraw] = useState("0");
  if (isLoading) return <p> Betting many... </p>;
  if (!data)
    return (
      <>
        <Box component="form" noValidate autoComplete="off">
          <Grid container direction="row" gap={2} alignItems="flex-end">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="proposal-input"> Amount to Withdraw </InputLabel>
                <OutlinedInput
                  id="proposal-input"
                  value={_withdraw}
                  onChange={(e) => setWithdraw(e.target.value)}
                  label="Witdraw Amount"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                size="large"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/ownerWithdraw?amount=${Number(_withdraw)}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setData(data);
                      setLoading(false);
                    });
                }}
              >
                {" "}
                Owner Withdraw{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  console.log(data);
  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}

function ReturnTokens() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [_return, setReturn] = useState("0");
  if (isLoading) return <p> Betting many... </p>;
  if (!data)
    return (
      <>
        <Box component="form" noValidate autoComplete="off">
          <Grid container direction="row" gap={2} alignItems="flex-end">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="proposal-input"> Tokens to Return </InputLabel>
                <OutlinedInput
                  id="proposal-input"
                  value={_return}
                  onChange={(e) => setReturn(e.target.value)}
                  label="Return Amount"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                size="large"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/returnTokens?amount=${Number(_return)}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setData(data);
                      setLoading(false);
                    });
                }}
              >
                {" "}
                Return Tokens{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  console.log(data);
  return (
    <div>
      <p> Your Hash is: {data.hash}</p>
    </div>
  );
}
