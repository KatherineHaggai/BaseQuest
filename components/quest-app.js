"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address, Hash } from "ox";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract
} from "wagmi";
import { formatUnits, hexToString, isAddressEqual, stringToHex } from "viem";
import { APP_ID, APP_NAME, baseQuestAbi, CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/basequest";
import { BUILDER_CODE, DATA_SUFFIX } from "@/lib/attribution";
import { trackTransaction } from "@/utils/track";

function truncate(value, start = 6, end = 4) {
  if (!value) return "";
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function decodeBytes32(value) {
  if (!value) return "";

  try {
    return hexToString(value, { size: 32 }).replace(/\0/g, "");
  } catch {
    return value;
  }
}

function toBytes32(input) {
  const bytes = new TextEncoder().encode(input);

  if (bytes.length > 32) {
    throw new Error("Use 32 bytes or fewer for onchain storage.");
  }

  return stringToHex(input, { size: 32 });
}

function parseReward(value) {
  const normalized = Number(value);

  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error("Reward must be a positive number.");
  }

  return BigInt(Math.floor(normalized));
}

async function handleTrackedTransaction({
  writeContractAsync,
  publicClient,
  address,
  config,
  onHash
}) {
  const txHash = await writeContractAsync(config);
  onHash?.(txHash);
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  if (address && Address.validate(address, { strict: false }) && Hash.validate(txHash)) {
    await trackTransaction(APP_ID, APP_NAME, Address.checksum(address), txHash);
  }

  return txHash;
}

function StatusBanner({ status }) {
  if (!status) return null;

  return <div className={`status status-${status.type}`}>{status.message}</div>;
}

function QuestCard({ quest, address, publicClient, writeContractAsync, onRefresh, setGlobalStatus }) {
  const [proof, setProof] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const { data: submissionsData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: baseQuestAbi,
    functionName: "getSubmissions",
    args: [quest.id],
    chainId: CHAIN_ID
  });

  const submissions = submissionsData ?? [];
  const isCreator =
    address && quest.creator ? isAddressEqual(address, quest.creator) : false;

  async function submitProof() {
    try {
      setIsSubmitting(true);
      setGlobalStatus({
        type: "info",
        message: `Submitting proof for quest #${quest.id}...`
      });

      const txHash = await handleTrackedTransaction({
        writeContractAsync,
        publicClient,
        address,
        config: {
          address: CONTRACT_ADDRESS,
          abi: baseQuestAbi,
          functionName: "submit",
          args: [quest.id, toBytes32(proof)]
        },
        onHash: (hash) =>
          setGlobalStatus({
            type: "info",
            message: `Proof submitted. Waiting for confirmation: ${hash}`
          })
      });

      setProof("");
      await Promise.all([refetch(), onRefresh()]);
      setGlobalStatus({
        type: "success",
        message: `Proof confirmed for quest #${quest.id}. Tx: ${txHash}`
      });
    } catch (error) {
      setGlobalStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Proof submission failed."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function acceptSubmission(index) {
    try {
      setIsAccepting(index);
      setGlobalStatus({
        type: "info",
        message: `Accepting submission #${index} for quest #${quest.id}...`
      });

      const txHash = await handleTrackedTransaction({
        writeContractAsync,
        publicClient,
        address,
        config: {
          address: CONTRACT_ADDRESS,
          abi: baseQuestAbi,
          functionName: "accept",
          args: [quest.id, BigInt(index)]
        },
        onHash: (hash) =>
          setGlobalStatus({
            type: "info",
            message: `Acceptance transaction sent: ${hash}`
          })
      });

      await Promise.all([refetch(), onRefresh()]);
      setGlobalStatus({
        type: "success",
        message: `Submission accepted for quest #${quest.id}. Tx: ${txHash}`
      });
    } catch (error) {
      setGlobalStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Accepting submission failed."
      });
    } finally {
      setIsAccepting(null);
    }
  }

  async function closeQuest() {
    try {
      setIsClosing(true);
      setGlobalStatus({
        type: "info",
        message: `Closing quest #${quest.id}...`
      });

      const txHash = await handleTrackedTransaction({
        writeContractAsync,
        publicClient,
        address,
        config: {
          address: CONTRACT_ADDRESS,
          abi: baseQuestAbi,
          functionName: "closeQuest",
          args: [quest.id]
        },
        onHash: (hash) =>
          setGlobalStatus({
            type: "info",
            message: `Close transaction sent: ${hash}`
          })
      });

      await Promise.all([refetch(), onRefresh()]);
      setGlobalStatus({
        type: "success",
        message: `Quest #${quest.id} closed. Tx: ${txHash}`
      });
    } catch (error) {
      setGlobalStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Closing quest failed."
      });
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <article className="quest-card">
      <header>
        <div>
          <div className="pill">Quest #{quest.id.toString()}</div>
          <h3 className="section-title" style={{ marginTop: 14 }}>
            {decodeBytes32(quest.content) || "Untitled Quest"}
          </h3>
        </div>
        <div className={`pill ${quest.active ? "pill-live" : "pill-closed"}`}>
          {quest.active ? "Live bounty" : "Closed"}
        </div>
      </header>

      <div className="quest-meta">
        <span>
          Reward Pool: <strong>{formatUnits(quest.reward, 0)} pts</strong>
        </span>
        <span className="mono">Creator: {truncate(quest.creator)}</span>
        <span className="mono">Contract: {truncate(CONTRACT_ADDRESS, 8, 6)}</span>
      </div>

      <div className="quest-actions">
        {quest.active && (
          <>
            <input
              className="input"
              value={proof}
              onChange={(event) => setProof(event.target.value)}
              placeholder="Enter a short proof string"
            />
            <button
              type="button"
              className="button button-secondary"
              disabled={!address || !proof || isSubmitting}
              onClick={submitProof}
            >
              {isSubmitting ? "Submitting..." : "Submit Proof"}
            </button>
          </>
        )}
        {isCreator && quest.active && (
          <button
            type="button"
            className="button button-ghost"
            disabled={isClosing}
            onClick={closeQuest}
          >
            {isClosing ? "Closing..." : "Close Quest"}
          </button>
        )}
      </div>

      <div className="submissions">
        <h4 className="section-title">Proof Queue</h4>
        {submissions.length === 0 ? (
          <p className="empty">No submissions yet. The first proof will appear here.</p>
        ) : (
          submissions.map((submission, index) => (
            <div key={`${quest.id}-${index}`} className="submission-card">
              <div className="submission-meta">
                <span className="mono">User: {truncate(submission.user)}</span>
                <span>Proof: {decodeBytes32(submission.proof) || submission.proof}</span>
                <span>Status: {submission.accepted ? "Accepted" : "Pending review"}</span>
              </div>
              {isCreator && !submission.accepted && quest.active ? (
                <div className="submission-actions">
                  <button
                    type="button"
                    className="button button-primary"
                    disabled={isAccepting === index}
                    onClick={() => acceptSubmission(index)}
                  >
                    {isAccepting === index ? "Accepting..." : "Accept Submission"}
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export function QuestApp() {
  const [content, setContent] = useState("");
  const [reward, setReward] = useState("25");
  const [status, setStatus] = useState(null);

  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient({ chainId: CHAIN_ID });
  const { writeContractAsync } = useWriteContract();

  const { data: questCountData, refetch: refetchQuestCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: baseQuestAbi,
    functionName: "questCount",
    chainId: CHAIN_ID
  });

  const questCount = Number(questCountData ?? 0n);

  const questContracts = useMemo(() => {
    return Array.from({ length: questCount }, (_, index) => ({
      address: CONTRACT_ADDRESS,
      abi: baseQuestAbi,
      functionName: "quests",
      args: [BigInt(index)],
      chainId: CHAIN_ID
    }));
  }, [questCount]);

  const { data: questsData, refetch: refetchQuests } = useReadContracts({
    contracts: questContracts,
    query: {
      enabled: questContracts.length > 0
    }
  });

  const quests = useMemo(() => {
    if (!questsData) return [];

    return questsData
      .map((item, index) => {
        const result = item.result;
        if (!result) return null;

        return {
          id: BigInt(index),
          content: result[0],
          creator: result[1],
          reward: result[2],
          active: result[3]
        };
      })
      .filter(Boolean)
      .reverse();
  }, [questsData]);

  useEffect(() => {
    if (isConnected && chainId !== CHAIN_ID) {
      setStatus({
        type: "error",
        message: "Switch to Base Mainnet to create or manage quests."
      });
    }
  }, [chainId, isConnected]);

  async function refreshAll() {
    await Promise.all([refetchQuestCount(), refetchQuests()]);
  }

  async function createQuest() {
    try {
      setStatus({
        type: "info",
        message: "Creating a new quest on Base..."
      });

      const txHash = await handleTrackedTransaction({
        writeContractAsync,
        publicClient,
        address,
        config: {
          address: CONTRACT_ADDRESS,
          abi: baseQuestAbi,
          functionName: "createQuest",
          args: [toBytes32(content), parseReward(reward)]
        },
        onHash: (hash) =>
          setStatus({
            type: "info",
            message: `Quest transaction sent: ${hash}`
          })
      });

      setContent("");
      setReward("25");
      await refreshAll();
      setStatus({
        type: "success",
        message: `Quest created successfully. Tx: ${txHash}`
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Quest creation failed."
      });
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="card hero-card">
          <div className="eyebrow">Base mini app • Quest protocol</div>
          <h1 className="headline">
            Launch quests. <span>Verify work.</span> Reward builders.
          </h1>
          <p className="lede">
            BaseQuest turns lightweight onchain events into a bright, fast workflow
            for publishing tasks, collecting proofs, and distributing bounty points.
          </p>
          <div className="hero-grid">
            <div className="metric">
              <strong>{questCount}</strong>
              <span>Quests indexed from the live Base contract.</span>
            </div>
            <div className="metric">
              <strong>8453</strong>
              <span>Base Mainnet only for clean transaction routing.</span>
            </div>
            <div className="metric">
              <strong>Event-first</strong>
              <span>Quest, proof, and acceptance logs drive the activity flow.</span>
            </div>
          </div>
        </div>

        <aside className="card spotlight">
          <div className="wallet-row">
            <div>
              <p className="section-copy">Wallet status</p>
              <h3 className="section-title">
                {isConnected ? truncate(address) : "Connect to Base"}
              </h3>
            </div>
            <ConnectButton />
          </div>

          <div className="spotlight-panel">
            <h3>Protocol Snapshot</h3>
            <p>
              Contract: <span className="mono">{CONTRACT_ADDRESS}</span>
            </p>
          </div>

          <div className="spotlight-panel">
            <h3>Mini App Meta</h3>
            <p>Hardcoded Base and Talent verification tags are already injected in the head.</p>
          </div>

          <div className="spotlight-panel">
            <h3>Attribution Ready</h3>
            <p>
              Builder code <span className="mono">{BUILDER_CODE}</span> is wired to
              ERC-8021 data suffix attribution for every write transaction.
            </p>
          </div>

          <div className="spotlight-panel">
            <h3>8021 Verified</h3>
            <p>
              Encoded suffix locked to <span className="mono">{truncate(DATA_SUFFIX, 16, 10)}</span>.
            </p>
          </div>
        </aside>
      </section>

      <section className="layout">
        <aside className="stack">
          <div className="card section-card">
            <h2 className="section-title">Create a Quest</h2>
            <p className="section-copy">
              Publish a short quest title and define the reward points that will be
              credited once a submission is accepted.
            </p>

            <div className="field">
              <label htmlFor="quest-content">Quest title</label>
              <textarea
                id="quest-content"
                className="textarea"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Example: Ship a wallet-ready onboarding flow"
              />
              <p className="field-help">Keep it under 32 bytes for the contract storage slot.</p>
            </div>

            <div className="field">
              <label htmlFor="quest-reward">Reward points</label>
              <input
                id="quest-reward"
                className="input"
                value={reward}
                inputMode="numeric"
                onChange={(event) => setReward(event.target.value)}
                placeholder="25"
              />
            </div>

            <div className="quest-actions">
              <button
                type="button"
                className="button button-primary"
                disabled={!isConnected || !content || !reward || chainId !== CHAIN_ID}
                onClick={createQuest}
              >
                Launch Quest
              </button>
            </div>

            <StatusBanner status={status} />
          </div>

          <div className="card section-card">
            <h2 className="section-title">How it Works</h2>
            <p className="section-copy">
              Creators post a quest, participants submit a proof string, and the creator
              approves the winning submission to credit points in the protocol.
            </p>
            <p className="footer-note">
              The contract is event-driven and optimized for lightweight quest operations.
            </p>
          </div>
        </aside>

        <section className="stack">
          <div className="card section-card">
            <h2 className="section-title">Live Quest Board</h2>
            <p className="section-copy">
              Onchain quests are fetched directly from Base. New proofs and accepted
              submissions will refresh after confirmation.
            </p>
          </div>

          <div className="quest-grid">
            {quests.length === 0 ? (
              <div className="card section-card">
                <p className="empty">
                  No quests have been indexed yet. Connect a wallet and launch the first one.
                </p>
              </div>
            ) : (
              quests.map((quest) => (
                <QuestCard
                  key={quest.id.toString()}
                  quest={quest}
                  address={address}
                  publicClient={publicClient}
                  writeContractAsync={writeContractAsync}
                  onRefresh={refreshAll}
                  setGlobalStatus={setStatus}
                />
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
